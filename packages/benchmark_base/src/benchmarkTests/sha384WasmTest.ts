import { Modules, WasmTestBaseClass } from './index';
// @ts-ignore
import wasmCryptoJS from 'crypto-js-wasm';
// @ts-ignore
import jsSha384 from 'crypto-js/sha384';

export default class Sha384WasmTest extends WasmTestBaseClass {
  dataSize: number;
  testStrings: Array<string> = [];
  testStringLength: number = 1024 * 1024 * 10;
  javascriptResult: Array<String> = [];
  wasmResult: Array<String> = [];

  constructor(
    dataSize: number,
    warmUpRunLoops: number,
    benchmarkRunLoops: number,
    modules: Modules,
  ) {
    super(warmUpRunLoops, benchmarkRunLoops, modules);
    this.dataSize = dataSize;

    this.initTestData();
    this.initRustSha384();
  }

  async initRustSha384() {
    return await wasmCryptoJS.SHA384.loadWasm();
  }

  static async initRustSha384() {
    return await wasmCryptoJS.SHA384.loadWasm();
  }

  initTestData() {
    for (let i = 0; i < this.dataSize; i++) {
      this.testStrings[i] = this.generateRandomString(this.testStringLength);
    }
  }

  runJavaScript(): Array<any> {
    for (let i = 0; i < this.dataSize; i++) {
      this.javascriptResult[i] = jsSha384(this.testStrings[i]).toString();
    }

    return this.javascriptResult;
  }

  runRustWasm() {
    for (let i = 0; i < this.dataSize; i++) {
      this.wasmResult[i] = wasmCryptoJS.SHA384(this.testStrings[i]).toString();
    }

    return this.wasmResult;
  }
}
