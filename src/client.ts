/**
 * Replicate Toolkit Client
 * 
 * A simplified and powerful client for interacting with Replicate AI models.
 * Includes built-in rate limiting, automatic retries, and easy-to-use APIs.
 */

import Replicate from 'replicate';
import { ReplicateQueue } from './queue';
import type {
  ReplicateToolkitOptions,
  PredictionResult,
  UpscaleOptions,
  ColorizeOptions,
  RestoreOptions,
  SharpenOptions,
  QueueStatus,
} from './types';

export class ReplicateToolkit {
  private client: Replicate;
  private queue: ReplicateQueue;
  private webhookUrl?: string;

  constructor(options: ReplicateToolkitOptions) {
    if (!options.apiToken) {
      throw new Error('apiToken is required');
    }

    this.client = new Replicate({
      auth: options.apiToken,
    });

    this.queue = new ReplicateQueue(
      options.minDelay || 10000,
      options.maxRequestsPerMinute || 5
    );

    this.webhookUrl = options.webhookUrl;
  }

  /**
   * Get queue status
   */
  getQueueStatus(): QueueStatus {
    return this.queue.getStatus();
  }

  /**
   * Execute a request through the queue
   */
  private async queueRequest<T>(execute: () => Promise<T>): Promise<T> {
    return this.queue.enqueue(execute);
  }

  /**
   * Extract URL from Replicate response
   */
  private async extractUrl(output: any): Promise<string> {
    if (typeof output === 'string') {
      return output;
    }

    if (output && typeof output === 'object' && typeof output.url === 'function') {
      return await output.url();
    }

    if (output && typeof output === 'object' && 'href' in output && typeof output.href === 'string') {
      return output.href;
    }

    if (Array.isArray(output) && output.length > 0) {
      const first = output[0];
      if (typeof first === 'string') {
        return first;
      }
      if (first && typeof first === 'object' && typeof first.url === 'function') {
        return await first.url();
      }
      if (first && typeof first === 'object' && 'href' in first && typeof first.href === 'string') {
        return first.href;
      }
    }

    if (output && typeof output === 'object') {
      const outputValue = output.output;
      if (typeof outputValue === 'string') {
        return outputValue;
      }
      if (Array.isArray(outputValue) && outputValue.length > 0) {
        if (typeof outputValue[0] === 'string') {
          return outputValue[0];
        }
      }
    }

    throw new Error('Failed to extract URL from Replicate response');
  }

  /**
   * Create an async prediction
   */
  async createPrediction(
    model: string,
    input: Record<string, any>
  ): Promise<PredictionResult> {
    return this.queueRequest(async () => {
      const options: any = {
        input,
      };

      if (model.includes(':')) {
        const [modelPart, versionPart] = model.split(':');
        options.model = modelPart;
        options.version = versionPart;
      } else {
        options.model = model;
      }

      if (this.webhookUrl) {
        options.webhook = this.webhookUrl;
        options.webhook_events_filter = ['completed'];
      }

      const prediction = await this.client.predictions.create(options);

      return {
        id: prediction.id,
        status: (prediction.status || 'starting') as PredictionResult['status'],
        created_at: prediction.created_at,
        started_at: prediction.started_at,
        completed_at: prediction.completed_at,
        error: prediction.error as string | undefined,
        metrics: prediction.metrics as PredictionResult['metrics'],
      };
    });
  }

  /**
   * Get prediction status
   */
  async getPrediction(predictionId: string): Promise<PredictionResult> {
    return this.queueRequest(async () => {
      const prediction = await this.client.predictions.get(predictionId);

      return {
        id: prediction.id,
        status: (prediction.status || 'unknown') as PredictionResult['status'],
        output: prediction.output as string | string[] | undefined,
        created_at: prediction.created_at,
        started_at: prediction.started_at,
        completed_at: prediction.completed_at,
        error: prediction.error as string | undefined,
        metrics: prediction.metrics as PredictionResult['metrics'],
      };
    });
  }

  /**
   * Wait for a prediction to complete
   */
  async waitForPrediction(
    predictionId: string,
    options: { interval?: number; timeout?: number } = {}
  ): Promise<PredictionResult> {
    const { interval = 2000, timeout = 300000 } = options;
    const startTime = Date.now();

    while (true) {
      const result = await this.getPrediction(predictionId);

      if (result.status === 'succeeded' || result.status === 'failed' || result.status === 'canceled') {
        return result;
      }

      if (Date.now() - startTime > timeout) {
        throw new Error(`Prediction timeout after ${timeout}ms`);
      }

      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  }

  /**
   * Upscale an image (async)
   */
  async upscale(imageUrl: string, options: UpscaleOptions = {}): Promise<PredictionResult> {
    const {
      scale = 2,
      faceEnhance = true,
      model = 'nightmareai/real-esrgan',
    } = options;

    const input = {
      image: imageUrl,
      scale: scale <= 4 ? scale : 4,
      face_enhance: faceEnhance,
    };

    return this.createPrediction(model, input);
  }

  /**
   * Upscale an image (sync, waits for completion)
   */
  async upscaleSync(imageUrl: string, options: UpscaleOptions = {}): Promise<string> {
    const prediction = await this.upscale(imageUrl, options);
    const result = await this.waitForPrediction(prediction.id);

    if (result.status !== 'succeeded' || !result.output) {
      throw new Error(`Upscale failed: ${result.error || 'Unknown error'}`);
    }

    return this.extractUrl(result.output);
  }

  /**
   * Colorize a black and white photo (async)
   */
  async colorize(imageUrl: string, options: ColorizeOptions = {}): Promise<PredictionResult> {
    const {
      model = 'cjwbw/bigcolor',
      renderFactor = 35,
      artistic = false,
    } = options;

    let input: Record<string, any>;

    if (model.includes('cjwbw/bigcolor')) {
      input = { image: imageUrl };
    } else if (model.includes('jantic/deoldify')) {
      input = {
        image: imageUrl,
        render_factor: renderFactor,
        artistic,
      };
    } else {
      input = { image: imageUrl };
    }

    return this.createPrediction(model, input);
  }

  /**
   * Colorize a black and white photo (sync, waits for completion)
   */
  async colorizeSync(imageUrl: string, options: ColorizeOptions = {}): Promise<string> {
    const prediction = await this.colorize(imageUrl, options);
    const result = await this.waitForPrediction(prediction.id);

    if (result.status !== 'succeeded' || !result.output) {
      throw new Error(`Colorize failed: ${result.error || 'Unknown error'}`);
    }

    return this.extractUrl(result.output);
  }

  /**
   * Restore an old photo (async)
   */
  async restore(imageUrl: string, options: RestoreOptions = {}): Promise<PredictionResult> {
    const {
      version = 'v1.4',
      scale = 2,
      weight = 0.7,
      model = 'tencentarc/gfpgan',
    } = options;

    let input: Record<string, any>;

    if (model.includes('tencentarc/gfpgan')) {
      input = {
        img: imageUrl,
        version,
        scale,
        weight,
      };
    } else if (model === 'microsoft/bringing-old-photos-back-to-life') {
      input = { image: imageUrl };
    } else {
      input = { image: imageUrl };
    }

    return this.createPrediction(model, input);
  }

  /**
   * Restore an old photo (sync, waits for completion)
   */
  async restoreSync(imageUrl: string, options: RestoreOptions = {}): Promise<string> {
    const prediction = await this.restore(imageUrl, options);
    const result = await this.waitForPrediction(prediction.id);

    if (result.status !== 'succeeded' || !result.output) {
      throw new Error(`Restore failed: ${result.error || 'Unknown error'}`);
    }

    return this.extractUrl(result.output);
  }

  /**
   * Sharpen an image (sync only, uses replicate.run)
   */
  async sharpen(
    imageUrl: string,
    options: SharpenOptions = {}
  ): Promise<string> {
    const {
      scale = 2,
      version = 'General - RealESRGANplus',
      faceEnhance = false,
    } = options;

    const actualScale = Math.max(2, Math.min(10, scale)) as 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

    const model = `xinntao/realesrgan:1b976a4d456ed9e4d1a846597b7614e79eadad3032e9124fa63859db0fd59b56`;
    const input = {
      img: imageUrl,
      tile: 0,
      scale: actualScale,
      version,
      face_enhance: faceEnhance,
    };

    return this.queueRequest(async () => {
      const output = await this.client.run(model, { input });
      return this.extractUrl(output);
    });
  }
}
