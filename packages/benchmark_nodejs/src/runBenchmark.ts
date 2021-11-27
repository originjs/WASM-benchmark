import fs from 'fs';

export async function runBenchmark(
  benchmarkDataset: any,
  result: any,
  testName: string,
  warnUpRunLoops: number = 1,
  benchmarkRunLoops: number = 10,
) {
  const wasmBinary = fs.readFileSync(benchmarkDataset.url);
  let module = {};
  const onRuntimeInitialized = () => {
    const wasmTest = new benchmarkDataset.testbench(
      benchmarkDataset.dataSize,
      warnUpRunLoops,
      benchmarkRunLoops,
      module,
    );

    setTimeout(() => {
      if (!wasmTest.checkFunctionality()) {
        console.log(`test ${testName}: Two functions seem not equal`);
        return;
      }

      setTimeout(() => {
        const jsPerformance = wasmTest.runJavaScriptBenchmark();
        setTimeout(() => {
          const wsPerformance = wasmTest.runWasmBenchmark();
          // @ts-ignore
          const comparison = (jsPerformance / wsPerformance).toFixed(4);
          result[testName] = { warnUpRunLoops, benchmarkRunLoops, comparison };
          console.log(
            `test ${testName}: jsPerformance / wsPerformance = ${comparison}`,
          );
          console.log(`test ${testName}: Done`);
        });
        console.log(`test ${testName}: Running WebAssembly`);
      });
      console.log(`test ${testName}: Running JavaScript`);
    });
    console.log(`test ${testName}: Checking equality`);
  };

  await Promise.resolve().then(() => {
    let moduleArgs = { wasmBinary, onRuntimeInitialized };
    module = benchmarkDataset.Module(moduleArgs);
  });
}
