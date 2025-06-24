import express from 'express';
import fetch from 'node-fetch';
import { URL, fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import { chunkText } from '../services/chunkTextService.mjs';
import { aggregateResults } from '../services/aggregatorService.mjs';
import { Worker } from 'node:worker_threads';



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Validate that URL is http(s) and not private/internal
function isValidPublicUrl(input) {
  try {
    const u = new URL(input);
    if (!['http:', 'https:'].includes(u.protocol)) return false;
    const host = u.hostname;
    // Block localhost and private IP ranges
    if (
      host === 'localhost' ||
      /^127\./.test(host) ||
      /^10\./.test(host) ||
      /^192\.168\./.test(host) ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

const router = express.Router();

router.post('/', async (req, res) => {
  let { text, names, url } = req.body;

  // If no text but URL provided, fetch via server after validation
  if (!text && url) {
    if (!isValidPublicUrl(url)) {
      return res.status(400).json({ error: 'Invalid or disallowed URL' });
    }
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Fetch failed with status ${response.status}`);
      }
      text = await response.text();
    } catch (err) {
      console.error('Fetch error:', err);
      return res.status(400).json({ error: 'Unable to fetch text from URL' });
    }
  }

  if (!text || !Array.isArray(names)) {
    return res
      .status(400)
      .json({ error: 'Invalid input – must provide text or URL and an array of names' });
  }

  const chunks = chunkText(text);

  try {
    const workerResults = await Promise.all(
      chunks.map((chunk, index) => runMatcherWorker(chunk, names, index))
    );
    const aggregated = aggregateResults(workerResults);
    return res.json(aggregated);
  } catch (err) {
    console.error('Worker error:', err);
    return res.status(500).json({ error: 'Internal server error during matching' });
  }
});

function runMatcherWorker(chunk, names, chunkIndex) {
  return new Promise((resolve, reject) => {
    const workerPath = path.resolve(__dirname, '../workers/matcherWorker.mjs');
    const worker = new Worker(workerPath, {
      workerData: { chunk, names, chunkIndex },
    });

    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', code => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

export default router;
