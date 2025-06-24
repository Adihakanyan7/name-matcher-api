import { parentPort, workerData } from 'node:worker_threads';

const { chunk, names, chunkIndex } = workerData;

const linesPerChunk = 1000;

const resultMap = {}; // name → array of locations

const lines = chunk.split('\n');
let charOffset = 0;

lines.forEach((line, lineIndex) => {
  const words = line.split(/\s+/);
  let currentCharInLine = 0;

  words.forEach((word) => {
    const cleanWord = word.replace(/[.,!?;:"()]/g, ''); // מנקה סימני פיסוק
    if (names.includes(cleanWord)) {
      if (!resultMap[cleanWord]) {
        resultMap[cleanWord] = [];
      }
      const calculatedOffset = Number(chunkIndex) * linesPerChunk + lineIndex;
      resultMap[cleanWord].push({
        lineOffset: calculatedOffset,
        charOffset: charOffset + currentCharInLine
      });
    }

    currentCharInLine += word.length + 1;
  });

  charOffset += line.length + 1; // +1 for '\n'
});

parentPort.postMessage(resultMap);
