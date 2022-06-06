import * as THREE from 'three';

export type Modules = {
  cModule?: any;
  rustModule?: any;
};

export type WasmBenchResults = {
  [wasmFuncName: string]: string;
};

export class WasmTestBaseClass {
  warmUpRunLoops: number;
  benchmarkRunLoops: number;
  modules: Modules;
  shouldOverrideError: Error;
  performance: any;

  constructor(
    warmUpRunLoops: number,
    benchmarkRunLoops: number,
    modules: Modules,
  ) {
    this.warmUpRunLoops = warmUpRunLoops;
    this.benchmarkRunLoops = benchmarkRunLoops;
    this.modules = modules;
    this.shouldOverrideError = Error(
      'Should override this function in sub class',
    );
    if (typeof window === 'undefined' && typeof global === 'object') {
      this.performance = require('perf_hooks').performance;
    } else {
      this.performance = performance;
    }
  }

  initTestData() {
    throw this.shouldOverrideError;
  }

  runJavaScript(): number | Array<any> | any | void {
    throw this.shouldOverrideError;
  }

  runCWasm() {
    throw this.shouldOverrideError;
  }

  runRustWasm() {
    throw this.shouldOverrideError;
  }

  getAllRunWasmFunc(): Array<Function> {
    const { cModule, rustModule } = this.modules;
    const { runCWasm, runRustWasm } = this;

    const allFunc: Array<Function> = [];
    if (cModule) {
      allFunc.push(runCWasm.bind(this));
    }
    if (rustModule) {
      allFunc.push(runRustWasm.bind(this));
    }
    return allFunc;
  }

  check(jsRes: any, wasmRes: any): boolean {
    // handle known return type.
    // If subclass runJavaScript() don't return these following types,
    // overwrite this.check, otherwise will throw a Error
    if (typeof jsRes === 'number') {
      return jsRes === wasmRes;
    } else if (
      Array.isArray(jsRes) || // array
      (ArrayBuffer.isView(jsRes) && !(jsRes instanceof DataView)) // TypedArray
    ) {
      return this.equalArray(jsRes, wasmRes);
    }

    throw this.shouldOverrideError;
  }

  runWasmBenchmark(): WasmBenchResults {
    const result: WasmBenchResults = {};

    for (const runWasm of this.getAllRunWasmFunc()) {
      for (let i = 0; i < this.warmUpRunLoops; i++) {
        runWasm.call(this); // warm-up
      }
      let elapsedTime = 0.0;
      for (let i = 0; i < this.benchmarkRunLoops; i++) {
        let startTime = this.performance.now();
        runWasm();
        let endTime = this.performance.now();
        elapsedTime += endTime - startTime;
      }
      const name = runWasm.name.replace('bound ', '');
      result[name] = (elapsedTime / this.benchmarkRunLoops).toFixed(4);
    }

    return result;
  }

  runJavaScriptBenchmark() {
    for (let i = 0; i < this.warmUpRunLoops; i++) {
      this.runJavaScript(); // warm-up
    }
    let elapsedTime = 0.0;
    for (let i = 0; i < this.benchmarkRunLoops; i++) {
      let startTime = this.performance.now();
      this.runJavaScript();
      let endTime = this.performance.now();
      elapsedTime += endTime - startTime;
    }
    return (elapsedTime / this.benchmarkRunLoops).toFixed(4);
  }

  checkFunctionality(): boolean {
    // run js
    const jsRes = this.runJavaScript();

    // run wasm functions and check equal
    for (const runWasm of this.getAllRunWasmFunc()) {
      if (!this.check(jsRes, runWasm())) {
        return false;
      }
    }
    return true;
  }

  equalArray(array1: any, array2: any): boolean {
    if (array1.length !== array2.length) return false;
    for (let i = 0, il = array1.length; i < il; i++) {
      if (array1[i] !== array2[i]) return false;
    }
    return true;
  }

  copyArray(src: any, res: any) {
    for (let i = 0, il = src.length; i < il; i++) {
      res[i] = src[i];
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
}

export class WasmTestImageBaseClass extends WasmTestBaseClass {
  image: any;
  canvas: any;
  jsCanvas: any;
  wsCanvas: any;
  jsContext: any;
  wsContext: any;
  width: number;
  height: number;
  imageData: any;
  jsImageData: any;
  wsImageData: any;

  constructor(
    dataSize: number,
    warmUpRunLoops: number,
    benchmarkRunLoops: number,
    modules: Object,
    dom: any,
    jsCanvas: any,
    wsCanvas: any,
  ) {
    super(warmUpRunLoops, benchmarkRunLoops, modules);
    this.image = dom;
    this.width = this.image.width;
    this.height = this.image.height;
    this.jsCanvas = jsCanvas;
    this.wsCanvas = wsCanvas;
  }

  initImageCanvasData() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    const context = this.canvas.getContext('2d');
    context.drawImage(this.image, 0, 0);
    this.imageData = context.getImageData(0, 0, this.width, this.height);

    this.jsCanvas.width = this.width;
    this.jsCanvas.height = this.height;
    this.jsContext = this.jsCanvas.getContext('2d');
    this.jsImageData = this.jsContext.getImageData(
      0,
      0,
      this.width,
      this.height,
    );

    this.wsCanvas.width = this.width;
    this.wsCanvas.height = this.height;
    this.wsContext = this.wsCanvas.getContext('2d');
    this.wsImageData = this.wsContext.getImageData(
      0,
      0,
      this.width,
      this.height,
    );
  }
}

export class WasmTestVideoAbstractBaseClass extends WasmTestBaseClass {
  module: any;
  video: any;
  renderer: any;
  gl: any;
  texture: any;
  renderTarget: any;
  camera: any;
  scene: any;
  jsCanvas: any;
  wsCanvas: any;
  jsContext: any;
  wsContext: any;
  videoDataArray: any;
  jsImageData: any;
  jsImageDataArray: any;
  wsImageData: any;
  wsImageDataArray: any;
  width: number;
  height: number;
  length: number;
  jsElapsedTime: number = 0.0;
  wsElapsedTime: number = 0.0;
  count: number = 0;
  videoCanvasDataInited = false;
  pointer1: any;

  constructor(
    dataSize: number,
    warmUpRunLoops: number,
    benchmarkRunLoops: number,
    module: Object,
    dom: any,
    jsCanvas: any,
    wsCanvas: any,
  ) {
    super(warmUpRunLoops, benchmarkRunLoops, { cModule: module });
    this.module = module;
    this.video = dom;
    this.width = this.video.videoWidth;
    this.height = this.video.videoHeight;
    this.length = this.width * this.height * 4;
    this.jsCanvas = jsCanvas;
    this.wsCanvas = wsCanvas;
    this.jsCanvas.width = this.width;
    this.jsCanvas.height = this.height;
    this.jsContext = this.jsCanvas.getContext('2d');
    this.wsCanvas.width = this.width;
    this.wsCanvas.height = this.height;
    this.wsContext = this.wsCanvas.getContext('2d');
    this.initThreeData();
  }

  runWasm(): number | Array<any> | any | void {
    throw this.shouldOverrideError;
  }

  initThreeData(): void {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.gl = this.renderer.getContext();
    this.texture = new THREE.Texture(this.video);
    this.texture.minFilter = THREE.NearestFilter;
    this.texture.magFilter = THREE.NearestFilter;
    this.texture.format = THREE.RGBAFormat;
    this.texture.wrapS = THREE.ClampToEdgeWrapping;
    this.texture.wrapT = THREE.ClampToEdgeWrapping;

    this.renderTarget = new THREE.WebGLRenderTarget(this.width, this.height);

    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.scene = new THREE.Scene();
    const shader = {
      uniforms: {
        tDiffuse: { value: null },
      },
      vertexShader: [
        'varying vec2 vUv;',
        'void main() {',
        '	vUv = uv;',
        '	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
        '}',
      ].join('\n'),
      fragmentShader: [
        'uniform sampler2D tDiffuse;',
        'varying vec2 vUv;',
        'void main() {',
        '	gl_FragColor = texture2D(tDiffuse, vec2(vUv.x, 1.0-vUv.y));',
        '}',
      ].join('\n'),
    };
    const material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(shader.uniforms),
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,
    });
    material.uniforms['tDiffuse'].value = this.texture;
    const quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), material);
    quad.frustumCulled = false; // Avoid getting clipped
    this.scene.add(quad);
  }

  updateOriginalImageData() {
    this.texture.needsUpdate = true;
    this.renderer.render(this.scene, this.camera, this.renderTarget);
    this.gl.readPixels(
      0,
      0,
      this.width,
      this.height,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      this.videoDataArray,
    );
  }

  runJavaScriptBenchmark(): any {
    const loop = 1;
    let elapsedTime = 0.0;
    for (let i = 0; i < loop; i++) {
      let startTime = performance.now();
      this.runJavaScript();
      let endTime = performance.now();
      elapsedTime += endTime - startTime;
    }
    return elapsedTime / loop;
  }

  runWasmBenchmark(): any {
    const loop = 1;
    let elapsedTime = 0.0;
    for (let i = 0; i < loop; i++) {
      let startTime = performance.now();
      this.runWasm();
      let endTime = performance.now();
      elapsedTime += endTime - startTime;
    }
    return elapsedTime / loop;
  }

  initVideoCanvasData(): void {
    // for Original
    this.videoDataArray = new Uint8Array(this.length);
    this.updateOriginalImageData();

    // for JavaScript
    this.jsImageDataArray = new Uint8ClampedArray(this.length);
    this.jsImageData = new ImageData(
      this.jsImageDataArray,
      this.width,
      this.height,
    );

    // for WebAssembly
    this.pointer1 = this.module._malloc(this.length);
    const offset1 = this.pointer1;
    const uint8ClampedArray = new Uint8ClampedArray(this.module.HEAPU8.buffer);
    this.wsImageDataArray = uint8ClampedArray.subarray(
      offset1,
      offset1 + this.length,
    );
    this.wsImageData = new ImageData(
      this.wsImageDataArray,
      this.width,
      this.height,
    );
  }
}
