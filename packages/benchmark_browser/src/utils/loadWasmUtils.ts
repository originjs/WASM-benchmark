export async function loadEmccCompiledWasm(
  wasmUrl: string,
  emccJsModule: Function,
) {
  let module;
  await fetch(wasmUrl)
    .then(response => response.arrayBuffer())
    .then(buffer => new Uint8Array(buffer))
    .then(binary => {
      let moduleArgs = {
        wasmBinary: binary,
        onRuntimeInitialized: () => {},
      };
      module = emccJsModule(moduleArgs);
    });
  return module;
}

export async function loadRustCompiledWasm(rustWasmUrl: string) {
  let rustModule: any = {};
  await import(/* @vite-ignore */ rustWasmUrl)
    .then(value => value.default())
    .then(exports => (rustModule = exports));
  return rustModule;
}
