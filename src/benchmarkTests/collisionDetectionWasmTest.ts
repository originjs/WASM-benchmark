import {WasmTestInterface} from "../utils/loadWasmUtils";

export default class CollisionDetectionWasmTest implements WasmTestInterface {
    array: Int32Array
    dataSize: number
    warmUpRunLoops: number
    benchmarkRunLoops: number
    module: any
    positions: any
    radiuses: Float64Array
    javascriptResult: Uint8Array
    wasmtResult: Uint8Array
    constructor(dataSize: number, warmUpRunLoops: number, benchmarkRunLoops: number, module: Object) {
        this.dataSize = dataSize
        this.warmUpRunLoops = warmUpRunLoops
        this.benchmarkRunLoops = benchmarkRunLoops
        this.module = module
        this.array = new Int32Array(this.dataSize)
        this.radiuses = new Float64Array(dataSize)
        this.positions = []
        this.javascriptResult = new Uint8Array(dataSize / 8)
        this.wasmtResult = new Uint8Array(dataSize / 8)

        this.initTestData()
    }

    static Position = class {
        x: number
        y: number
        z: number
        constructor(x: number, y: number, z: number) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
    }

    initTestData(): void {
        this.initPositions()
        this.initRadiuses()
    }

    initPositions(): void {
        for (let i = 0; i < this.dataSize; i++) {
            const x = Math.random() * 2000 - 1000;
            const y = Math.random() * 2000 - 1000;
            const z = Math.random() * 2000 - 1000;
            this.positions[i] = new CollisionDetectionWasmTest.Position(x, y, z);
        }
    }

    initRadiuses(): void {
        for (var i = 0, il = this.radiuses.length; i < il; i++) {
            this.radiuses[i] = Math.random() * 10
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
