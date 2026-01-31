# replicate-toolkit-client

> A simplified and powerful TypeScript toolkit for interacting with Replicate AI models. Includes built-in rate limiting, automatic retries, and easy-to-use APIs for image processing tasks.

## Features

- 🔒 **Built-in Rate Limiting** - Automatically manages request queues to prevent API rate limit errors
- 🚀 **Easy-to-Use API** - Simple, intuitive methods for common AI image processing tasks
- ⚡ **Async & Sync Support** - Use async predictions with webhooks or wait for results synchronously
- 📦 **TypeScript Support** - Full TypeScript types for better developer experience
- 🎨 **Multiple AI Models** - Support for image upscaling, colorization, photo restoration, and sharpening

## Installation

```bash
npm install replicate-toolkit-client
```

or with yarn:

```bash
yarn add replicate-toolkit-client
```

or with pnpm:

```bash
pnpm add replicate-toolkit-client
```

## Quick Start

```typescript
import { ReplicateToolkit } from 'replicate-toolkit-client';

// Initialize the client
const toolkit = new ReplicateToolkit({
  apiToken: process.env.REPLICATE_API_TOKEN,
  // Optional: Customize rate limiting
  minDelay: 10000,           // 10 seconds between requests (default)
  maxRequestsPerMinute: 5,    // 5 requests per minute (default)
  webhookUrl: 'https://your-site.com/api/webhook', // Optional webhook URL
});

// Upscale an image
const upscaledUrl = await toolkit.upscaleSync(
  'https://example.com/image.jpg',
  { scale: 4, faceEnhance: true }
);

console.log('Upscaled image:', upscaledUrl);
```

## Usage Examples

### Image Upscaling

**Async (with webhooks):**

```typescript
// Create async prediction
const prediction = await toolkit.upscale('https://example.com/image.jpg', {
  scale: 4,
  faceEnhance: true,
  model: 'nightmareai/real-esrgan',
});

console.log('Prediction ID:', prediction.id);
// Use webhookUrl to receive completion callback
```

**Sync (wait for completion):**

```typescript
// Wait for result
const resultUrl = await toolkit.upscaleSync('https://example.com/image.jpg', {
  scale: 2,
});

console.log('Result:', resultUrl);
```

### Photo Colorization

Convert black and white photos to color:

```typescript
// Using BigColor model (recommended)
const coloredUrl = await toolkit.colorizeSync(
  'https://example.com/bw-photo.jpg',
  { model: 'cjwbw/bigcolor' }
);

// Using DeOldify model
const coloredUrl = await toolkit.colorizeSync(
  'https://example.com/bw-photo.jpg',
  { 
    model: 'jantic/deoldify-image',
    renderFactor: 35,
    artistic: false,
  }
);
```

### Photo Restoration

Restore old, damaged photos:

```typescript
const restoredUrl = await toolkit.restoreSync(
  'https://example.com/old-photo.jpg',
  {
    version: 'v1.4',
    scale: 2,
    weight: 0.7,
    model: 'tencentarc/gfpgan',
  }
);
```

### Image Sharpening

Sharpen and enhance image quality:

```typescript
const sharpenedUrl = await toolkit.sharpen('https://example.com/blurry.jpg', {
  scale: 2,
  version: 'General - RealESRGANplus',
  faceEnhance: false,
});
```

### Working with Predictions

Check prediction status:

```typescript
const prediction = await toolkit.createPrediction(
  'nightmareai/real-esrgan',
  { image: 'https://example.com/image.jpg', scale: 2 }
);

// Check status
const status = await toolkit.getPrediction(prediction.id);
console.log('Status:', status.status);

// Wait for completion
const result = await toolkit.waitForPrediction(prediction.id);
console.log('Output:', result.output);
```

### Queue Management

Monitor request queue:

```typescript
const status = toolkit.getQueueStatus();
console.log('Queue length:', status.queueLength);
console.log('Processing:', status.processing);
console.log('Requests in current window:', status.requestsInCurrentWindow);
console.log('Time until next window:', status.timeUntilNextWindow);
```

## API Reference

### Constructor Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `apiToken` | `string` | Yes | - | Your Replicate API token |
| `minDelay` | `number` | No | `10000` | Minimum delay between requests (ms) |
| `maxRequestsPerMinute` | `number` | No | `5` | Maximum requests per minute |
| `webhookUrl` | `string` | No | - | Webhook URL for async predictions |

### Methods

#### `upscale(imageUrl, options?)`

Upscale an image asynchronously.

- `imageUrl` (`string`) - URL of the image to upscale
- `options` (`UpscaleOptions`)
  - `scale` (`2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10`) - Scale factor (default: 2)
  - `faceEnhance` (`boolean`) - Enable face enhancement (default: true)
  - `model` (`string`) - Model to use (default: 'nightmareai/real-esrgan')
- Returns: `Promise<PredictionResult>`

#### `upscaleSync(imageUrl, options?)`

Upscale an image and wait for completion.

- Same parameters as `upscale()`
- Returns: `Promise<string>` - URL of upscaled image

#### `colorize(imageUrl, options?)`

Colorize a black and white photo asynchronously.

- `imageUrl` (`string`) - URL of the image to colorize
- `options` (`ColorizeOptions`)
  - `model` (`string`) - Model to use (default: 'cjwbw/bigcolor')
  - `renderFactor` (`number`) - Render factor for DeOldify (20-50, default: 35)
  - `artistic` (`boolean`) - Artistic mode (default: false)
- Returns: `Promise<PredictionResult>`

#### `colorizeSync(imageUrl, options?)`

Colorize a photo and wait for completion.

- Same parameters as `colorize()`
- Returns: `Promise<string>` - URL of colorized image

#### `restore(imageUrl, options?)`

Restore an old photo asynchronously.

- `imageUrl` (`string`) - URL of the image to restore
- `options` (`RestoreOptions`)
  - `version` (`string`) - GFP-GAN version (default: 'v1.4')
  - `scale` (`number`) - Scale factor (default: 2)
  - `weight` (`number`) - Restoration weight (0-1, default: 0.7)
  - `model` (`string`) - Model to use (default: 'tencentarc/gfpgan')
- Returns: `Promise<PredictionResult>`

#### `restoreSync(imageUrl, options?)`

Restore a photo and wait for completion.

- Same parameters as `restore()`
- Returns: `Promise<string>` - URL of restored image

#### `sharpen(imageUrl, options?)`

Sharpen an image (synchronous only).

- `imageUrl` (`string`) - URL of the image to sharpen
- `options` (`SharpenOptions`)
  - `scale` (`2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10`) - Scale factor (default: 2)
  - `version` - Real-ESRGAN version (default: 'General - RealESRGANplus')
  - `faceEnhance` (`boolean`) - Enable face enhancement (default: false)
- Returns: `Promise<string>` - URL of sharpened image

#### `createPrediction(model, input)`

Create a custom async prediction.

- `model` (`string`) - Model name (with optional version)
- `input` (`Record<string, any>`) - Input parameters
- Returns: `Promise<PredictionResult>`

#### `getPrediction(predictionId)`

Get prediction status.

- `predictionId` (`string`) - Prediction ID
- Returns: `Promise<PredictionResult>`

#### `waitForPrediction(predictionId, options?)`

Wait for prediction to complete.

- `predictionId` (`string`) - Prediction ID
- `options` (`{ interval?, timeout? }`)
  - `interval` (`number`) - Polling interval in ms (default: 2000)
  - `timeout` (`number`) - Timeout in ms (default: 300000)
- Returns: `Promise<PredictionResult>`

#### `getQueueStatus()`

Get current queue status.

- Returns: `QueueStatus`

## Use Cases

This toolkit is perfect for:

- 🖼️ Image enhancement web applications
- 📱 Mobile apps with AI image processing
- 🤖 Chatbots with image capabilities
- 🎨 Creative tools and design platforms
- 📸 Photo editing applications

## Production Example

This toolkit is used in production at [onlineimageupscaler.com](https://onlineimageupscaler.com), a free AI-powered image upscaler and enhancement platform. Check it out for a live demonstration of these capabilities!

## Rate Limiting

The toolkit automatically manages rate limits to prevent API errors:

- Default: 5 requests per minute
- Minimum 10 seconds between requests
- Automatic queue management
- Configurable limits

## Error Handling

All methods throw errors on failure. Wrap in try-catch:

```typescript
try {
  const result = await toolkit.upscaleSync(url);
  console.log('Success:', result);
} catch (error) {
  console.error('Failed:', error.message);
}
```

## Requirements

- Node.js >= 18.0.0
- Replicate API token (get one at [replicate.com](https://replicate.com))

## License

MIT © LueYueqing

## Support

For issues and questions, please use the [GitHub Issues](https://github.com/LueYueqing/replicate-toolkit/issues) page.

## See Also

- [Replicate Documentation](https://replicate.com/docs)
- [onlineimageupscaler.com](https://onlineimageupscaler.com) - Live demo using this toolkit
- [GitHub Repository](https://github.com/LueYueqing/replicate-toolkit)
- [Replicate Models Gallery](https://replicate.com/explore)
