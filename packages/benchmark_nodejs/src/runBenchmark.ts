import fs from 'fs';
import { Modules } from '../../benchmark_base/src/benchmarkTests';

export async function runBenchmark(
  benchmarkDataset: any,
  result: any,
  jsonPath: string | null,
  testName: string,
  warnUpRunLoops: number = 1,
  benchmarkRunLoops: number = 10,
) {
  function updateResAndWriteJson(comparisons: number) {
    if (!result || !jsonPath) {
      return;
    }

    result.testResults.push({
      testName,
      warnUpRunLoops,
      benchmarkRunLoops,
      comparisons,
    });
    fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2));
  }

  const wasmBinary = fs.readFileSync(benchmarkDataset.cWasmUrl);
  let modules: Modules = {};
  const onRuntimeInitialized = () => {
    console.log(`${benchmarkDataset.cWasmUrl} is loaded`);
    const wasmTest = new benchmarkDataset.testbench(
      benchmarkDataset.dataSize,
      warnUpRunLoops,
      benchmarkRunLoops,
      modules,
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
          const wsPerformances = wasmTest.runWasmBenchmark();
          const comparisons: any = {};
          for (const runWasmFuncName in wsPerformances) {
            const comparison = (
              jsPerformance / wsPerformances[runWasmFuncName]
            ).toFixed(4);
            comparisons[runWasmFuncName] = Number.parseFloat(comparison);
            console.log(
              `test ${testName} ${runWasmFuncName}: jsPerformance / wsPerformance = ${comparison}`,
            );
          }
          updateResAndWriteJson(comparisons);

          console.log(`test ${testName}: Done`);
        });
      });
    });
    console.log(`test ${testName}: Checking equality`);
  };

  await Promise.resolve().then(() => {
    let cModuleArgs = { wasmBinary, onRuntimeInitialized };
    modules.cModule = benchmarkDataset.cGlueFunc(cModuleArgs);
  });
}
