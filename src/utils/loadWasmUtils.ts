export async function loadEmccCompiledWasm(wasmUrl: string, emccJsModule: Function) {
    let module
    await fetch(wasmUrl)
        .then(response => response.arrayBuffer())
        .then(buffer => new Uint8Array(buffer))
        .then(binary => {
            let moduleArgs = {
                wasmBinary: binary,
                onRuntimeInitialized: () => {},
            }
            module = emccJsModule(moduleArgs)
        })
    return module
}

export interface WasmTestInterface {
    initTestData(): void
    runWasm(): number
    runWasmBenchmark(): string
    runJavaScript(): number
    runJavaScriptBenchmark(): string
}
