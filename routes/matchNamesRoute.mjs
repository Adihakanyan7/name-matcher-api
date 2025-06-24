import express from 'express';
import {chunkText} from '../services/chunkTextService.mjs';
import { aggregateResults } from '../services/aggregatorService.mjs';
import { Worker } from 'node:worker_threads';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

router.post('/', async (req, res) =>{
    const {text, names} = req.body;
    if (!text || !names || !Array.isArray(names)) {
        return res.status(400).json({ error: 'Invalid input - Must provide text and an array of names' });
    }
    const chunks = chunkText(text);
    console.log("Chunks created:", chunks,  "Type:", Array.isArray(chunks));

    
  try {
    const results = await Promise.all(
    chunks.map((chunk, index) => {
        console.log(`Processing chunk ${index + 1}/${chunks.length}`);
        return runMatcherWorker(chunk, names, index);
    })
    );
    const aggregated = aggregateResults(results);
    res.json(aggregated);

  } catch (err) {
    console.error('Worker failed:', err);
    res.status(500).json({ error: 'Worker processing failed' });
  }
});

function runMatcherWorker(chunk, names, chunkIndex) {
  return new Promise((resolve, reject) => {
    const workerPath = path.resolve(__dirname, '../workers/matcherWorker.mjs');

    const worker = new Worker(workerPath, {
      workerData: { chunk, names, chunkIndex }
    });

    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}


export default router;

