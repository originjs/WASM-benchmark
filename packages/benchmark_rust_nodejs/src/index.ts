import { runBenchmark } from './runBenchmark';
// @ts-ignore
import benchmarkDatasets from "./benchmarkDatasets/benchmarkDatasets";


(() => {
  const result = {}
  const jsonPath = './benchmark_nodejs_result.json';
  runBenchmark(benchmarkDatasets.multiplyDouble, result, jsonPath, 'multiplyDouble')
})();
