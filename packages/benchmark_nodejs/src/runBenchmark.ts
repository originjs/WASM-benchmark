import fs from 'fs';

export async function runBenchmark(benchmarkDataset: any) {
  const wasmBinary = fs.readFileSync(benchmarkDataset.url);
  let module = {};
  const onRuntimeInitialized = () => {
    const wasmTest = new benchmarkDataset.testbench(
      benchmarkDataset.dataSize,
      1,
      10,
      module,
    );

    setTimeout(() => {
      if (!wasmTest.checkFunctionality()) {
        console.log('Two functions seem not equal');
        return;
      }

      setTimeout(() => {
        const jsPerformance = wasmTest.runJavaScriptBenchmark();
        setTimeout(() => {
          const wsPerformance = wasmTest.runWasmBenchmark();
          // @ts-ignore
          const comparison = (jsPerformance / wsPerformance).toFixed(4);
          console.log(comparison);
          console.log('Done');
        });
        console.log('Running WebAssembly');
      });
      console.log('Running JavaScript');
    });
    console.log('Checking equality');
  };

  await Promise.resolve().then(() => {
    let moduleArgs = { wasmBinary, onRuntimeInitialized };
    module = benchmarkDataset.Module(moduleArgs);
  });
}
