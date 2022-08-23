import { Modules, WasmTestBaseClass } from './index';

// @ts-ignore
import wasmCryptoJS from '@originjs/crypto-js-wasm';
import JSEncrypt from 'jsencrypt';

export default class Sha1WasmTest extends WasmTestBaseClass {
    dataSize: number;
    testStrings: Array<string> = [];
    testStringLength: number = 501;
    publicKey: string;
    privateKey: string;
    jsEncrypt: JSEncrypt;
    jsDecrypt: JSEncrypt;
    jsEncryptResult: Array<string> = [];
    jsDecryptResult: Array<string> = [];
    rustEncryptResult: Array<Uint8Array> = [];
    rustDecryptResult: Array<string> = [];

    constructor(
        dataSize: number,
        warmUpRunLoops: number,
        benchmarkRunLoops: number,
        modules: Modules,
    ) {
        super(warmUpRunLoops, benchmarkRunLoops, modules);
        this.dataSize = dataSize;

        this.jsEncrypt = new JSEncrypt();
        this.jsDecrypt = new JSEncrypt();
        wasmCryptoJS.RSA.updateConfig({
            key: 4096,
            encryptPadding: 'pkcs1v15'
        })
        this.privateKey = wasmCryptoJS.RSA.getKeyContent('private', 'pem');
        this.publicKey = wasmCryptoJS.RSA.getKeyContent('public', 'pem');

        this.jsEncrypt.setPublicKey(this.publicKey);
        this.jsDecrypt.setPrivateKey(this.privateKey);

        this.initTestData();
    }

    static async initRustRsa() {
        return await wasmCryptoJS.RSA.loadWasm();
    }

    initTestData() {
        for (let i = 0; i < this.dataSize; i++) {
            this.testStrings[i] = this.generateRandomString(this.testStringLength);
        }
    }

    runJavaScript(): Array<any> {
        for (let i = 0; i < this.dataSize; i++) {
            this.jsEncryptResult[i] = this.jsEncrypt.encrypt(this.testStrings[i]) + '';
            this.jsDecryptResult[i] = this.jsDecrypt.decrypt(this.jsEncryptResult[i]) + '';
        }

        return this.jsDecryptResult;
    }

    runRustWasm() {
        let decoder = new TextDecoder();
        for (let i = 0; i < this.dataSize; i++) {
            this.rustEncryptResult[i] = wasmCryptoJS.RSA.encrypt(this.testStrings[i]);
            this.rustDecryptResult[i] = decoder.decode(wasmCryptoJS.RSA.decrypt(this.rustEncryptResult[i]));
        }

        return this.rustDecryptResult;
    }
}
