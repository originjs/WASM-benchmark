import benchmarkDatasets from './benchmarkDatasets/benchmarkDatasets';
import { runBenchmark } from './runBenchmark';
import { question } from 'readline-sync';

(async () => {
  let result = {};

  console.log('\n=== javascript webassembly benchmark in nodejs ===\n');
  let [index, map] = [1, {}];
  for (let testName in benchmarkDatasets) {
    console.log(`${index}: ${testName}`);
    // @ts-ignore
    map[index++] = testName;
  }

  const answer: string = question('Please a choose a test(input its index): ');
  const testIndex = Number.parseInt(answer);
  if (testIndex >= index) {
    console.log(`\nwrong index !! index should range from 1 to ${index - 1}.`);
    return;
  }
  // @ts-ignore
  await runBenchmark(benchmarkDatasets[map[testIndex]], result, map[testIndex]);
})();
