export async function loadEmccCompiledWasm(
  cWasmUrl: string,
  cGlueFunc: Function,
) {
  // get c wasm binary
  let cWasmBinary: any;
  if (typeof window === 'undefined' && typeof global === 'object') {
    cWasmBinary = require('fs').readFileSync(cWasmUrl);
  } else {
    cWasmBinary = await fetch(cWasmUrl)
      .then(response => response.arrayBuffer())
      .then(buffer => new Uint8Array(buffer));
  }

  // init cModule
  let module = {};
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

export async function loadRustCompiledWasm(rustWasmUrl: string) {
  return import(/* @vite-ignore */ rustWasmUrl).then(exports => {
    console.log(`${rustWasmUrl} is loaded`);
    console.log(exports)
    return exports;
  });
}
