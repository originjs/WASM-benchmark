import { WasmTestInterface, WasmTestAbstractBaseClass } from './index';

export default class CollisionDetectionWasmTest
  extends WasmTestAbstractBaseClass
  implements WasmTestInterface
{
  array: Int32Array;
  dataSize: number;
  positions: any;
  radiuses: Float64Array;
  javascriptResult: Uint8Array;
  wasmtResult: Uint8Array;
  constructor(
    dataSize: number,
    warmUpRunLoops: number,
    benchmarkRunLoops: number,
    module: Object,
  ) {
    super(warmUpRunLoops, benchmarkRunLoops, module);
    this.dataSize = dataSize;
    this.array = new Int32Array(this.dataSize);
    this.radiuses = new Float64Array(dataSize);
    this.positions = [];
    this.javascriptResult = new Uint8Array(dataSize / 8);
    this.wasmtResult = new Uint8Array(dataSize / 8);

    this.initTestData();
  }

  static Position = class {
    x: number;
    y: number;
    z: number;
    constructor(x: number, y: number, z: number) {
      this.x = x;
      this.y = y;
      this.z = z;
    }
  };

  initTestData(): void {
    this.initPositions();
    this.initRadiuses();
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
    for (let i = 0, il = this.radiuses.length; i < il; i++) {
      this.radiuses[i] = Math.random() * 10;
    }
  }

  checkFunctionality(): boolean {
    this.clearArray(this.javascriptResult);
    this.clearArray(this.wasmtResult);
    let count1 = this.runJavaScript();
    let count2 = this.runWasm();
    return (
      count1 === count2 &&
      this.equalArray(this.javascriptResult, this.wasmtResult)
    );
  }

  clearArray(array: Uint8Array): void {
    for (let i = 0, il = array.length; i < il; i++) {
      array[i] = 0;
    }
  }

  equalArray(array1: Uint8Array, array2: Uint8Array): boolean {
    if (array1.length !== array2.length) return false;
    for (let i = 0, il = array1.length; i < il; i++) {
      if (array1[i] !== array2[i]) return false;
    }
    return true;
  }

  runWasm(): number {
    let pointer1 = this.module._malloc(this.positions.length * 3 * 8);
    let pointer2 = this.module._malloc(this.radiuses.length * 8);
    let pointer3 = this.module._malloc(this.wasmtResult.length);
    let offset1 = pointer1 / 8;
    let offset2 = pointer2 / 8;
    let offset3 = pointer3;
    this.setPositionsToFloat64Array(
      this.positions,
      this.module.HEAPF64,
      offset1,
    );
    this.module.HEAPF64.set(this.radiuses, offset2);
    let result = this.module._collisionDetection(
      pointer1,
      pointer2,
      pointer3,
      this.dataSize,
    );
    this.wasmtResult.set(
      this.module.HEAPU8.subarray(offset3, offset3 + this.wasmtResult.length),
    );
    this.module._free(pointer1);
    this.module._free(pointer2);
    this.module._free(pointer3);
    return result;
  }

  runJavaScript(): number {
    let count = 0;
    for (let i = 0; i < this.dataSize; i++) {
      let p = this.positions[i];
      let r = this.radiuses[i];
      let collision = 0;
      for (let j = i + 1; j < this.dataSize; j++) {
        let p2 = this.positions[j];
        let dx = p.x - p2.x;
        let dy = p.y - p2.y;
        let dz = p.z - p2.z;
        let d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (r > d) {
          collision = 1;
          count++;
          break;
        }
      }
      let index = (i / 8) | 0;
      let pos = 7 - (i % 8);
      if (collision === 0) {
        this.javascriptResult[index] &= ~(1 << pos);
      } else {
        this.javascriptResult[index] |= 1 << pos;
      }
    }
    return count;
  }

  setPositionsToFloat64Array(positions: any, array: any, offset: number): void {
    for (let i = 0, il = positions.length; i < il; i++) {
      let index = offset + i * 3;
      array[index + 0] = positions[i].x;
      array[index + 1] = positions[i].y;
      array[index + 2] = positions[i].z;
    }
  }
}
