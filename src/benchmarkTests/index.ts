export interface WasmTestInterface {
    initTestData(): void
    runWasm(): number
    runWasmBenchmark(): string
    runJavaScript(): number
    runJavaScriptBenchmark(): string
}

export class WasmTestAbstractBaseClass implements WasmTestInterface {
    dataSize: number
    warmUpRunLoops: number
    benchmarkRunLoops: number
    module: any

    constructor() {}

    runWasm(): number {
        throw new Error('This method should be implemented in inherited class')
    }

    runJavaScript(): number {
        throw new Error('This method should be implemented in inherited class')
    }

    runWasmBenchmark(): string {
        for (let i = 0; i < this.warmUpRunLoops; i++) {
            this.runWasm(); // warm-up
        }
        let elapsedTime = 0.0;
        for (let i = 0; i < this.benchmarkRunLoops; i++) {
            let startTime = performance.now();
            this.runWasm();
            let endTime = performance.now();
            elapsedTime += (endTime - startTime);
        }
        return (elapsedTime / this.benchmarkRunLoops).toFixed(4);
    }

    runJavaScriptBenchmark() {
        for (let i = 0; i < this.warmUpRunLoops; i++) {
            this.runJavaScript(); // warm-up
        }
        let elapsedTime = 0.0;
        for (let i = 0; i < this.benchmarkRunLoops; i++) {
            let startTime = performance.now();
            this.runJavaScript();
            let endTime = performance.now();
            elapsedTime += (endTime - startTime);
        }
        return (elapsedTime / this.benchmarkRunLoops).toFixed(4);
    }
}
