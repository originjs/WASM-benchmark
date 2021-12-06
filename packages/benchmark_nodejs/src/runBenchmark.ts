import fs from 'fs';

export async function runBenchmark(
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

  const wasmBinary = fs.readFileSync(benchmarkDataset.url);
  let module = {};
  const onRuntimeInitialized = () => {
    console.log(`${benchmarkDataset.url} is loaded`);
    const wasmTest = new benchmarkDataset.testbench(
      benchmarkDataset.dataSize,
      warnUpRunLoops,
      benchmarkRunLoops,
      module,
    );

    Promise.resolve(1).then(() => {
      if (!wasmTest.checkFunctionality()) {
        console.log(`test ${testName}: Two functions seem not equal`);
        return;
      }

      console.log(`test ${testName}: Running JavaScript`);
      Promise.resolve(1).then(() => {
        const jsPerformance = Number.parseFloat(
          wasmTest.runJavaScriptBenchmark(),
        );
        console.log(`test ${testName}: Running WebAssembly`);
        Promise.resolve(1).then(() => {
          const wsPerformance = Number.parseFloat(wasmTest.runWasmBenchmark());
          const comparison = (jsPerformance / wsPerformance).toFixed(4);
          updateResAndWriteJson(Number.parseFloat(comparison));
          console.log(
            `test ${testName}: jsPerformance / wsPerformance = ${comparison}`,
          );
          console.log(`test ${testName}: Done`);
        });
      });
    });
    console.log(`test ${testName}: Checking equality`);
  };

  await Promise.resolve().then(() => {
    let moduleArgs = { wasmBinary, onRuntimeInitialized };
    module = benchmarkDataset.Module(moduleArgs);
  });
}
