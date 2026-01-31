/**
 * Global Request Queue for Replicate API
 * 
 * This module manages a global queue for all Replicate API requests to prevent
 * exceeding rate limits. It ensures requests are processed sequentially with
 * appropriate delays between requests.
 */

import type { QueueStatus } from './types';

interface QueuedRequest<T> {
  id: string;
  execute: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: any) => void;
  timestamp: number;
}

export class ReplicateQueue {
  private queue: QueuedRequest<any>[] = [];
  private processing = false;
  private lastRequestTime = 0;
  private minDelay: number;
  private requestCount = 0;
  private windowStart = Date.now();
  private maxRequestsPerMinute: number;

  constructor(minDelay = 10000, maxRequestsPerMinute = 5) {
    this.minDelay = minDelay;
    this.maxRequestsPerMinute = maxRequestsPerMinute;
  }

  /**
   * Add a request to the queue
   */
  async enqueue<T>(execute: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const request: QueuedRequest<T> = {
        id: `${Date.now()}-${Math.random()}`,
        execute,
        resolve,
        reject,
        timestamp: Date.now(),
      };

      this.queue.push(request);
      this.processQueue();
    });
  }

  /**
   * Process the queue sequentially
   */
  private async processQueue() {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      const request = this.queue.shift();
      if (!request) break;

      try {
        // Check if we need to wait before processing
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;

        // Reset window if a minute has passed
        if (now - this.windowStart >= 60000) {
          this.requestCount = 0;
          this.windowStart = now;
        }

        // Check if we've exceeded the rate limit for this minute
        if (this.requestCount >= this.maxRequestsPerMinute) {
          const waitTime = 60000 - (now - this.windowStart) + 1000; // Wait until next window + 1 second buffer
          console.log(`[ReplicateQueue] Rate limit reached. Waiting ${Math.ceil(waitTime / 1000)} seconds...`);
          await this.delay(waitTime);
          this.requestCount = 0;
          this.windowStart = Date.now();
        }

        // Ensure minimum delay between requests
        if (timeSinceLastRequest < this.minDelay) {
          const waitTime = this.minDelay - timeSinceLastRequest;
          console.log(`[ReplicateQueue] Waiting ${Math.ceil(waitTime / 1000)} seconds before next request...`);
          await this.delay(waitTime);
        }

        // Execute the request
        console.log(`[ReplicateQueue] Processing request ${request.id} (${this.queue.length} remaining)`);
        this.lastRequestTime = Date.now();
        this.requestCount++;

        const result = await request.execute();
        request.resolve(result);
      } catch (error) {
        console.error(`[ReplicateQueue] Request ${request.id} failed:`, error);
        request.reject(error);
      }
    }

    this.processing = false;
  }

  /**
   * Get queue status
   */
  getStatus(): QueueStatus {
    return {
      queueLength: this.queue.length,
      processing: this.processing,
      requestsInCurrentWindow: this.requestCount,
      timeUntilNextWindow: Math.max(0, 60000 - (Date.now() - this.windowStart)),
    };
  }

  /**
   * Clear the queue (for testing or emergency)
   */
  clear(): void {
    this.queue.forEach((request) => {
      request.reject(new Error('Queue cleared'));
    });
    this.queue = [];
    this.processing = false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
