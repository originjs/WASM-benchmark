import { Modules, WasmTestBaseClass } from './index';
// @ts-ignore
// import wasmCryptoJS from 'crypto-js-wasm';
// @ts-ignore
import jsCryptoJS from 'crypto-js/crypto-js';

export default class DesWasmTest extends WasmTestBaseClass {
  dataSize: number;
  testStrings: Array<string> = [];
  testStringLength: number = 1024 * 100;
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
    this.initRustdes();
  }

  async initRustdes() {
    // wasmCryptoJS.DES.loadWasm();
  }

  initTestData() {
    for (let i = 0; i < this.dataSize; i++) {
      this.testStrings[i] = this.generateRandomString(this.testStringLength);
    }
  }

  generateRandomString(length: number): string {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  runJavaScript(): Array<any> {
    for (let i = 0; i < this.dataSize; i++) {
      this.jsEncryptResult[i] = jsCryptoJS.DES.encrypt(this.testStrings[i], this.key).toString();
      this.jsDecryptResult[i] = jsCryptoJS.DES.decrypt(this.jsEncryptResult[i], this.key).toString(jsCryptoJS.enc.Utf8);
    }

    return this.jsDecryptResult;
  }

  runRustWasm() {
    for (let i = 0; i < this.dataSize; i++) {
      // this.rustEncryptResult[i] = wasmCryptoJS.DES.encrypt(this.testStrings[i], this.key).toString();
      // this.rustDecryptResult[i] = wasmCryptoJS.DES.decrypt(this.rustEncryptResult[i], this.key).toString(wasmCryptoJS.enc.Utf8);
    }

    return this.rustDecryptResult;
  }
}
