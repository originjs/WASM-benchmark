import {WasmTestInterface} from "../utils/loadWasmUtils";

export default class SumIntWasmTest implements WasmTestInterface {
    array: Int32Array
    dataSize: number
    warmUpRunLoops: number
    benchmarkRunLoops: number
    module: any
    constructor(dataSize: number, warmUpRunLoops: number, benchmarkRunLoops: number, module: Object) {
        this.dataSize = dataSize
        this.warmUpRunLoops = warmUpRunLoops
        this.benchmarkRunLoops = benchmarkRunLoops
        this.module = module
        this.array = new Int32Array(this.dataSize)

        this.initTestData()
    }

    initTestData(): void {
        for (let i = 0, il = this.array.length; i < il; i++) {
            this.array[i] = ((Math.random() * 20000) | 0) - 10000;
        }
    }

    runWasm() {
        const pointer = this.module._malloc(this.array.length * 4)
        const offset = pointer / 4
        this.module.HEAP32.set(this.array, offset)
        const result = this.module._sumInt(pointer, this.dataSize)
        this.module._free(pointer)
        return result
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

    runJavaScript(): number {
        let s = 0
        for (let i = 0; i < this.dataSize; i++) {
            s += this.array[i]
        }
        return s
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
