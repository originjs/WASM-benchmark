import { Modules, WasmTestBaseClass } from './index';
// @ts-ignore
import wasmCryptoJS from 'crypto-js-wasm';
// @ts-ignore
import jsRipemd160 from 'crypto-js/ripemd160';

export default class Ripemd160WasmTest extends WasmTestBaseClass {
  dataSize: number;
  testStrings: Array<string> = [];
  testStringLength: number = 1024 * 1024 * 10;
  jsEncryptResult: Array<String> = [];
  jsDecryptResult: Array<String> = [];
  rustEncryptResult: Array<String> = [];
  rustDecryptResult: Array<String> = [];
  key: string;

  constructor(
    dataSize: number,
    warmUpRunLoops: number,
    benchmarkRunLoops: number,
    modules: Modules,
  ) {
    super(warmUpRunLoops, benchmarkRunLoops, modules);
    this.dataSize = dataSize;
    this.key = "key";

    this.initTestData();
    this.initRustRipemd160();
  }

  async initRustRipemd160() {
    return await wasmCryptoJS.RIPEMD160.loadWasm();
  }

  static async initRustRipemd160() {
    return await wasmCryptoJS.RIPEMD160.loadWasm();
  }

  initTestData() {
    for (let i = 0; i < this.dataSize; i++) {
      this.testStrings[i] = this.generateRandomString(this.testStringLength);
    }
  }

  runJavaScript(): Array<any> {
    for (let i = 0; i < this.dataSize; i++) {
      this.jsEncryptResult[i] = jsRipemd160(this.testStrings[i]).toString();
    }

    return this.jsEncryptResult;
  }

  runRustWasm() {
    for (let i = 0; i < this.dataSize; i++) {
      this.rustEncryptResult[i] = wasmCryptoJS.RIPEMD160(this.testStrings[i]).toString();
    }

    return this.rustEncryptResult;
  }
}
