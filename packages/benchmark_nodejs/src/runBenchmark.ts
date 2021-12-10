import fs from 'fs';
import { Modules } from '../../benchmark_base/src/benchmarkTests';

async function loadEmccCompiledWasm(cWasmUrl: string, cGlueFunc: Function) {
  let module = {};
  const cWasmBinary = fs.readFileSync(cWasmUrl);
  await new Promise(resolve => {
    let cModuleArgs = {
      wasmBinary: cWasmBinary,
      onRuntimeInitialized: () => {
        console.log(`${cWasmUrl} is loaded`);
        resolve(null);
      },
    };
    module = cGlueFunc(cModuleArgs);
  });
  return module;
}

function loadRustCompiledWasm(rustWasmUrl: string, imports: any = {}) {
  const rustWasmBinary = fs.readFileSync(rustWasmUrl);
  const wasmModule = new WebAssembly.Module(rustWasmBinary);
  const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
  console.log(`${rustWasmUrl} is loaded`);
  return wasmInstance.exports;
}

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

  // init modules
  const { cWasmUrl, cGlueFunc, rustWasmUrl } = benchmarkDataset;
  let modules: Modules = {};
  // init modules.cModule
  if (!!cWasmUrl && !!cGlueFunc) {
    modules.cModule = await loadEmccCompiledWasm(cWasmUrl, cGlueFunc);
  }
  // init modules.rustModule
  if (!!rustWasmUrl) {
    modules.rustModule = loadRustCompiledWasm(rustWasmUrl);
  }

  // init test class
  const wasmTest = new benchmarkDataset.testbench(
    benchmarkDataset.dataSize,
    warnUpRunLoops,
    benchmarkRunLoops,
    modules,
  );

  // run test, Note this should return a Promise !!
  return new Promise((resolve, reject) => {
    console.log(`test ${testName}: Checking equality`);
    if (!wasmTest.checkFunctionality()) {
      console.log(`test ${testName}: Two functions seem not equal`);
      reject();
    }
    resolve(null);
  }).then(() => {
    console.log(`test ${testName}: Running JavaScript`);
    const jsPerformance = Number.parseFloat(wasmTest.runJavaScriptBenchmark());

    console.log(`test ${testName}: Running WebAssembly`);
    const wsPerformances = wasmTest.runWasmBenchmark();

    const comparisons: any = {};
    for (const runWasmFuncName in wsPerformances) {
      const wsPerformance = wsPerformances[runWasmFuncName];
      const comparison = (jsPerformance / wsPerformance).toFixed(4);
      comparisons[runWasmFuncName] = Number.parseFloat(comparison);
      console.log(
        `test ${testName} ${runWasmFuncName}: jsPerformance / wsPerformance = ${comparison}`,
      );
    }

    updateResAndWriteJson(comparisons);
    console.log(`test ${testName}: Done\n`);
  });
}
