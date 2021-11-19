import { WasmTestAbstractBaseClass } from './index';

export default class quicksortDoubleWasmTest extends WasmTestAbstractBaseClass {
  dataSize: number;
  array0: Float64Array;
  array1: Float64Array;
  array2: Float64Array;

  constructor(
    dataSize: number,
    warmUpRunLoops: number,
    benchmarkRunLoops: number,
    module: Object,
  ) {
    super(warmUpRunLoops, benchmarkRunLoops, module);
    this.dataSize = dataSize;
    this.array0 = new Float64Array(this.dataSize); // master
    this.array1 = new Float64Array(this.dataSize); // for JavaScript
    this.array2 = new Float64Array(this.dataSize); // for WebAssembly
    this.initTestData();
  }

  initTestData(): void {
    for (let i = 0, il = this.array0.length; i < il; i++) {
      this.array0[i] = Math.random() * 200 - 100;
    }
  }

  copyArray(src: Float64Array, res: Float64Array) {
    for (let i = 0, il = src.length; i < il; i++) {
      res[i] = src[i];
    }
  }

  checkFunctionality(): boolean {
    function equalArray(array1: Float64Array, array2: Float64Array) {
      if (array1.length !== array2.length) return false;
      for (let i = 0, il = array1.length; i < il; i++) {
        if (array1[i] !== array2[i]) return false;
      }
      return true;
    }

    function orderIsOk(array: Float64Array) {
      for (let i = 1, il = array.length; i < il; i++) {
        if (array[i - 1] > array[i]) return false;
      }
      return true;
    }

    this.runJavaScript();
    this.runWasm();
    if (!orderIsOk(this.array1)) return false;
    return equalArray(this.array1, this.array2);
  }

  runWasm(): void {
    this.copyArray(this.array0, this.array2);
    let pointer = this.module._malloc(this.array2.length * 8);
    let offset = pointer / 8;
    this.module.HEAPF64.set(this.array2, offset);
    this.module._quicksortDouble(pointer, 0, this.array2.length - 1);
    this.array2.set(
      this.module.HEAPF64.subarray(offset, offset + this.array2.length),
    );
    this.module._free(pointer);
  }

  runJavaScript(): void {
    function jsQuicksortInt(array: Float64Array, start: number, end: number) {
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
