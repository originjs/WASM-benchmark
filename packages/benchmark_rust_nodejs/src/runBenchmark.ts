import fs from 'fs';


export function runBenchmark(
  benchmarkDataset: any,
  result: any,
  jsonPath: string | null,
  testName: string,
  warnUpRunLoops: number = 1,
  benchmarkRunLoops: number = 10,
) {
  function updateResAndWriteJson(comparison: number) {
    if (!result || !jsonPath) {
      return;
    }

    result.testResults.push({
      testName,
      warnUpRunLoops,
      benchmarkRunLoops,
      comparison,
    });
    fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2));
  }

  const wasmTest = new benchmarkDataset.testbench(
      benchmarkDataset.dataSize,
      warnUpRunLoops,
      benchmarkRunLoops,
      benchmarkDataset.rustWasmFunc,
  )

  console.log(`test ${testName}: Checking equality`);
  if (!wasmTest.checkFunctionality()) {
    console.log(`test ${testName}: Two functions seem not equal`);
    return;
  }

  console.log(`test ${testName}: Running JavaScript`);
  const jsPerformance = wasmTest.runJavaScriptBenchmark();

  console.log(`test ${testName}: Running WebAssembly`);
  const wsPerformance = wasmTest.runWasmBenchmark();

  const comparison = (jsPerformance / wsPerformance).toFixed(4);
  updateResAndWriteJson(Number.parseFloat(comparison));
  console.log(`test ${testName}: jsPerformance / wsPerformance = ${comparison}`);
  console.log(`test ${testName}: Done`);
}
