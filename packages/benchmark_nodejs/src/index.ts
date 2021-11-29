import benchmarkDatasets from './benchmarkDatasets/benchmarkDatasets';
import { runBenchmark } from './runBenchmark';
import { question } from 'readline-sync';

(async () => {
  let result = {};
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
  if (testIndex >= index) {
    console.log(`\nwrong index !! index should range from 1 to ${index - 1}.`);
    return;
  }

  if (testIndex > 1) {
    // @ts-ignore
    await runBenchmark(benchmarkDatasets[map[testIndex]], result, map[testIndex]);
    return;
  }

  function recursiveTest(i: number) {
    if (i < index - 1) {
      // @ts-ignore
      return runBenchmark(benchmarkDatasets[map[i]], result, map[i]).then(
        () => {
          recursiveTest(i + 1);
        },
      );
    }

    // @ts-ignore
    return runBenchmark(benchmarkDatasets[map[i]], result, map[i]);
  }

  recursiveTest(startIndex);
})();
