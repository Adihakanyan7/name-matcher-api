export function aggregateResults(workerResults) {
  const aggregated = {};

  for (const result of workerResults) {
    for (const name in result) {
      if (!aggregated[name]) {
        aggregated[name] = [];
      }

      aggregated[name].push(...result[name]);
    }
  }

  return aggregated;
}

