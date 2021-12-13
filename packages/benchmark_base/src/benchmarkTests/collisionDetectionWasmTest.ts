import { Modules, WasmTestBaseClass } from './index';

export default class CollisionDetectionWasmTest extends WasmTestBaseClass {
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
    modules: Modules,
  ) {
    super(warmUpRunLoops, benchmarkRunLoops, modules);
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

  check(jsRes: any, wasmRes: any) {
    return (
      jsRes === wasmRes &&
      this.equalArray(this.javascriptResult, this.wasmtResult)
    );
  }

  clearArray(array: Uint8Array): void {
    for (let i = 0, il = array.length; i < il; i++) {
      array[i] = 0;
    }
  }

  getAllRunWasmFunc(): Array<Function> {
    const runCWasm = () => {
      this.clearArray(this.wasmtResult);
      const module = this.modules.cModule;

      let pointer1 = module._malloc(this.positions.length * 3 * 8);
      let pointer2 = module._malloc(this.radiuses.length * 8);
      let pointer3 = module._malloc(this.wasmtResult.length);
      let offset1 = pointer1 / 8;
      let offset2 = pointer2 / 8;
      let offset3 = pointer3;
      this.setPositionsToFloat64Array(this.positions, module.HEAPF64, offset1);
      module.HEAPF64.set(this.radiuses, offset2);
      let result = module._collisionDetection(
        pointer1,
        pointer2,
        pointer3,
        this.dataSize,
      );
      this.wasmtResult.set(
        module.HEAPU8.subarray(offset3, offset3 + this.wasmtResult.length),
      );
      module._free(pointer1);
      module._free(pointer2);
      module._free(pointer3);
      return result;
    };
    return [runCWasm];
  }

  runJavaScript(): number {
    this.clearArray(this.javascriptResult);

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
