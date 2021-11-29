import benchmarkDatasets from './benchmarkDatasets/benchmarkDatasets';
import { runBenchmark } from './runBenchmark';
import { question } from 'readline-sync';

(async () => {
  let result = { testResults: [] };
  const jsonPath = './benchmark_nodejs_result.json';
  const startIndex = 2;

  console.log('\n=== javascript webassembly benchmark in nodejs ===\n');
  let [index, map] = [startIndex, {}];

  console.log(`1: all tests`);
  for (let testName in benchmarkDatasets) {
    console.log(`${index}: ${testName}`);
    // @ts-ignore
    map[index++] = testName;
  }

  const answer: string = question('Please a choose a test(input its index): ');
  const testIndex = Number.parseInt(answer);
  // check input valid
  if (testIndex >= index) {
    console.log(`\nwrong index !! index should range from 1 to ${index - 1}.`);
    return;
  }

  // run all test
  if (testIndex === 1) {
    for (let i = 2; i < index; i++) {
      // @ts-ignore
      await runBenchmark(benchmarkDatasets[map[i]], result, jsonPath, map[i]);
    }
    return;
  }

  // run specific test
  await runBenchmark(
    // @ts-ignore
    benchmarkDatasets[map[testIndex]],
    null,
    null,
    // @ts-ignore
    map[testIndex],
  );
  return;
})();
