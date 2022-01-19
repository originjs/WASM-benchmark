import {Modules, WasmTestBaseClass} from "./index";
// @ts-ignore
import rustMd5Test from 'crypto-js-wasm-test/md5-wasm'
// @ts-ignore
import jsMd5 from 'crypto-js/md5'
// @ts-ignore
import hashTest from 'murmur3hash-wasm'

export default class Md5WasmTest extends WasmTestBaseClass {
    dataSize: number
    testStrings: Array<string> = []
    testStringLength: number = 1024 * 1024 * 10
    javascriptResult: Array<String> = []
    wasmResult: Array<String> = []
    md5: any

    constructor(
        dataSize: number,
        warmUpRunLoops: number,
        benchmarkRunLoops: number,
        modules: Modules,
    ) {
        super(warmUpRunLoops, benchmarkRunLoops, modules)
        this.dataSize = dataSize

        this.initTestData()
        this.initRustMd5()
    }

    async initRustMd5() {
        rustMd5Test.loadWasm()
    }

    initTestData() {
        for (let i = 0; i < this.dataSize; i++) {
            this.testStrings[i] = this.generateRandomString(this.testStringLength);
        }
    }

    generateRandomString(length: number): string {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }

    check(jsRes: any, wasmRes: any) {
        return this.equalArray(this.javascriptResult, this.wasmResult)
    }

    runJavaScript(): void {
        for (let i = 0; i < this.dataSize; i++) {
            this.javascriptResult[i] = jsMd5(this.testStrings[i]).toString();
        }
    }

    async runRustWasm() {
        this.clearArray(this.wasmResult);

        for (let i = 0; i < this.dataSize; i++) {
            this.wasmResult[i] = rustMd5Test.process(this.testStrings[i]).toString();
        }
    }

    clearArray(array: Array<String>): void {
        for (let i = 0, il = array.length; i < il; i++) {
            array[i] = '';
        }
    }
}
