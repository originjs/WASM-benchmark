import { Modules, WasmTestBaseClass } from './index';

export default class quicksortIntWasmTest extends WasmTestBaseClass {
  dataSize: number;
  array0: Int32Array;
  array1: Int32Array;
  array2: Int32Array;

  constructor(
    dataSize: number,
    warmUpRunLoops: number,
    benchmarkRunLoops: number,
    modules: Modules,
  ) {
    super(warmUpRunLoops, benchmarkRunLoops, modules);
    this.dataSize = dataSize;
    this.array0 = new Int32Array(this.dataSize); // master
    this.array1 = new Int32Array(this.dataSize); // for JavaScript
    this.array2 = new Int32Array(this.dataSize); // for WebAssembly
    this.initTestData();
  }

  initTestData(): void {
    for (let i = 0, il = this.array0.length; i < il; i++) {
      this.array0[i] = ((Math.random() * 20000) | 0) - 10000;
    }
  }

  check(jsRes: any, wasmRes: any): boolean {
    function orderIsOk(array: Int32Array) {
      for (let i = 1, il = array.length; i < il; i++) {
        if (array[i - 1] > array[i]) return false;
      }
      return true;
    }
    if (!orderIsOk(this.array1)) return false;
    return this.equalArray(this.array1, this.array2);
  }

  runCWasm() {
    const module = this.modules.cModule;

    this.copyArray(this.array0, this.array2);
    let pointer = module._malloc(this.array2.length * 4);
    let offset = pointer / 4;
    module.HEAP32.set(this.array2, offset);
    module._quicksortInt(pointer, 0, this.array2.length - 1);
    this.array2.set(
      module.HEAP32.subarray(offset, offset + this.array2.length),
    );
    module._free(pointer);
  }

  runJavaScript(): void {
    function jsQuicksortInt(array: Int32Array, start: number, end: number) {
      if (start >= end) return;
      let pivot = array[end];
      let left = 0;
      let right = 0;
      while (left + right < end - start) {
        let num = array[start + left];
        if (num < pivot) {
          left++;
        } else {
          array[start + left] = array[end - right - 1];
          array[end - right - 1] = pivot;
          array[end - right] = num;
          right++;
        }
      }
      jsQuicksortInt(array, start, start + left - 1);
      jsQuicksortInt(array, start + left + 1, end);
    }

    this.copyArray(this.array0, this.array1);
    jsQuicksortInt(this.array1, 0, this.array1.length - 1);
  }
}
