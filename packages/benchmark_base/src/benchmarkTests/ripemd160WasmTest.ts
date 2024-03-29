import { Modules, WasmTestBaseClass } from './index';
import wasmCryptoJS from '@originjs/crypto-js-wasm';
// @ts-ignore
import jsRipemd160 from 'crypto-js/ripemd160';

export default class Ripemd160WasmTest extends WasmTestBaseClass {
  dataSize: number;
  testStrings: Array<string> = [];
  testStringLength: number = 1024 * 1024 * 10;
  jsEncryptResult: Array<string> = [];
  jsDecryptResult: Array<string> = [];
  rustEncryptResult: Array<string> = [];
  rustDecryptResult: Array<string> = [];
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
