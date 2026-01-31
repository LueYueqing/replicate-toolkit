/**
 * Type definitions for Replicate Toolkit
 */

export interface ReplicateToolkitOptions {
  /**
   * Replicate API token (required)
   */
  apiToken: string;
  
  /**
   * Minimum delay between requests in milliseconds (default: 10000)
   */
  minDelay?: number;
  
  /**
   * Maximum requests per minute (default: 5)
   */
  maxRequestsPerMinute?: number;
  
  /**
   * Webhook URL for async predictions (optional)
   */
  webhookUrl?: string;
}

export interface PredictionResult {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  output?: string | string[];
  error?: string;
  created_at?: string;
  started_at?: string;
  completed_at?: string;
  metrics?: {
    predict_time?: number;
  };
}

export interface UpscaleOptions {
  /**
   * Scale factor (2-10)
   */
  scale?: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  
  /**
   * Whether to enhance faces (default: true)
   */
  faceEnhance?: boolean;
  
  /**
   * Model to use (e.g., 'nightmareai/real-esrgan')
   */
  model?: string;
}

export interface ColorizeOptions {
  /**
   * Render factor for DeOldify model (20-50, default: 35)
   */
  renderFactor?: number;
  
  /**
   * Artistic mode (default: false)
   */
  artistic?: boolean;
  
  /**
   * Model to use (e.g., 'cjwbw/bigcolor', 'jantic/deoldify-image')
   */
  model?: string;
}

export interface RestoreOptions {
  /**
   * GFP-GAN version (default: 'v1.4')
   */
  version?: string;
  
  /**
   * Scale factor (default: 2)
   */
  scale?: number;
  
  /**
   * Restoration weight (0-1, default: 0.7)
   */
  weight?: number;
  
  /**
   * Model to use (e.g., 'tencentarc/gfpgan')
   */
  model?: string;
}

export interface SharpenOptions {
  /**
   * Scale factor (2-10, default: 2)
   */
  scale?: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  
  /**
   * Real-ESRGAN version
   */
  version?: 'General - RealESRGANplus' | 'General - v3' | 'Anime - anime6B' | 'AnimeVideo - v3';
  
  /**
   * Whether to enhance faces
   */
  faceEnhance?: boolean;
}

export interface QueueStatus {
  queueLength: number;
  processing: boolean;
  requestsInCurrentWindow: number;
  timeUntilNextWindow: number;
}
