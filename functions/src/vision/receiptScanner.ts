import { ImageAnnotatorClient } from '@google-cloud/vision';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { z } from 'zod';

const schema = z.object({
  imageUrl: z.string().url()
});

export const scanReceipt = onCall({ region: 'us-central1', cors: true }, async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in is required.');
  const { imageUrl } = schema.parse(request.data);
  const client = new ImageAnnotatorClient();
  const [result] = await client.textDetection(imageUrl);
  const text = result.fullTextAnnotation?.text ?? '';

  return {
    text,
    lineCount: text.split('\n').filter(Boolean).length
  };
});
