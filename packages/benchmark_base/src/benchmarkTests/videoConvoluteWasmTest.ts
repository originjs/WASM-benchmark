import { WasmTestAbstractBaseClass } from './index';
import * as THREE from 'three';

export default class VideoConvoluteWasmTest extends WasmTestAbstractBaseClass {
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
  pointer1: any;
  pointer2: any;
  pointer3: any;
  width: number;
  height: number;
  length: number;
  weights: Float64Array = new Float64Array([
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
  ]);
  wWidth: number = 5;
  wHeight: number = 5;
  jsElapsedTime: number = 0.0;
  wsElapsedTime: number = 0.0;
  count: number = 0;
  videoCanvasDataInited = false;

  constructor(
    dataSize: number,
    warmUpRunLoops: number,
    benchmarkRunLoops: number,
    module: Object,
    dom: any,
    jsCanvas: any,
    wsCanvas: any,
  ) {
    super(warmUpRunLoops, benchmarkRunLoops, module);
    this.video = dom;
    this.width = this.video.videoWidth;
    this.height = this.video.videoHeight;
    this.length = this.width * this.height * 4;
    this.jsCanvas = jsCanvas;
    this.wsCanvas = wsCanvas;
    this.initThreeData();
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

  initVideoCanvasData(): void {
    this.jsCanvas.width = this.width;
    this.jsCanvas.height = this.height;
    this.jsContext = this.jsCanvas.getContext('2d');

    this.wsCanvas.width = this.width;
    this.wsCanvas.height = this.height;
    this.wsContext = this.wsCanvas.getContext('2d');

    const uint8Array = new Uint8Array(this.module.HEAPU8.buffer);

    // for Original
    this.pointer1 = this.module._malloc(this.length);
    const offset1 = this.pointer1;
    this.videoDataArray = uint8Array.subarray(offset1, offset1 + this.length);
    this.updateOriginalImageData();

    // for JavaScript
    this.jsImageDataArray = new Uint8ClampedArray(this.length);
    this.jsImageData = new ImageData(
      this.jsImageDataArray,
      this.width,
      this.height,
    );

    // for WebAssembly
    this.pointer2 = this.module._malloc(this.length);
    this.pointer3 = this.module._malloc(this.weights.length * 8);
    const offset2 = this.pointer2;
    const offset3 = this.pointer3 / 8;
    this.module.HEAPF64.set(this.weights, offset3);
    const uint8ClampedArray = new Uint8ClampedArray(this.module.HEAPU8.buffer);
    this.wsImageDataArray = uint8ClampedArray.subarray(
      offset2,
      offset2 + this.length,
    );
    this.wsImageData = new ImageData(
      this.wsImageDataArray,
      this.width,
      this.height,
    );
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

  render(vueInstance: any) {
    this.updateOriginalImageData();

    this.jsElapsedTime += this.runJavaScriptBenchmark();
    this.wsElapsedTime += this.runWasmBenchmark();
    this.jsContext.putImageData(this.jsImageData, 0, 0);
    this.wsContext.putImageData(this.wsImageData, 0, 0);
    this.count++;

    if (this.count === this.benchmarkRunLoops) {
      const jsPerformance = (
        this.jsElapsedTime / this.benchmarkRunLoops
      ).toFixed(4);
      const wsPerformance = (
        this.wsElapsedTime / this.benchmarkRunLoops
      ).toFixed(4);
      vueInstance.jsPerformance = jsPerformance;
      vueInstance.wsPerformance = wsPerformance;
      vueInstance.comparison = (
        Number(jsPerformance) / Number(wsPerformance)
      ).toFixed(4);
      this.jsElapsedTime = 0.0;
      this.wsElapsedTime = 0.0;
      this.count = 0;
    }
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

  checkFunctionality(): boolean {
    if (!this.videoCanvasDataInited) {
      this.initVideoCanvasData();
      this.videoCanvasDataInited = true;
    }
    this.runWasm();
    this.runJavaScript();
    return this.equalArray(this.jsImageDataArray, this.wsImageDataArray);
  }

  runWasm(): void {
    this.module._imageConvolute(
      this.pointer1,
      this.pointer2,
      this.width,
      this.height,
      this.pointer3,
      this.wWidth,
      this.wHeight,
    );
  }

  runJavaScript(): void {
    const halfWWidth = (this.wWidth / 2) | 0;
    const halfWHeight = (this.wHeight / 2) | 0;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let r = 0;
        let g = 0;
        let b = 0;
        let a = 0;
        for (let wy = 0; wy < this.wHeight; wy++) {
          const sy = y + wy - halfWHeight;
          if (sy < 0 || sy >= this.height) continue;
          for (let wx = 0; wx < this.wWidth; wx++) {
            const sx = x + wx - halfWWidth;
            if (sx < 0 || sx >= this.width) continue;
            const index = sy * this.width + sx;
            const weight = this.weights[wy * this.wWidth + wx];
            r += this.videoDataArray[index * 4 + 0] * weight;
            g += this.videoDataArray[index * 4 + 1] * weight;
            b += this.videoDataArray[index * 4 + 2] * weight;
            a += this.videoDataArray[index * 4 + 3] * weight;
          }
        }
        const index = y * this.width + x;
        this.jsImageDataArray[index * 4 + 0] = r | 0;
        this.jsImageDataArray[index * 4 + 1] = g | 0;
        this.jsImageDataArray[index * 4 + 2] = b | 0;
        this.jsImageDataArray[index * 4 + 3] = a | 0;
      }
    }
  }
}
