import { WasmTestVideoAbstractBaseClass } from './index';
// Using cv.js and aruco.js of https://github.com/jcmellado/js-aruco
// They're edited a little bit
// @ts-ignore
import AR from '../markerDetection/aruco.js';
// @ts-ignore
import CV from '../markerDetection/cv.js';

export default class VideoMarkerDetectionWasmTest extends WasmTestVideoAbstractBaseClass {
  pointer0: any;
  _detector: any;

  constructor(
    dataSize: number,
    warmUpRunLoops: number,
    benchmarkRunLoops: number,
    module: Object,
    dom: any,
    jsCanvas: any,
    wsCanvas: any,
  ) {
    super(
      dataSize,
      warmUpRunLoops,
      benchmarkRunLoops,
      module,
      dom,
      jsCanvas,
      wsCanvas,
    );
  }

  render(vueInstance: any) {
    this.updateOriginalImageData();

    this.jsElapsedTime += this.runJavaScriptBenchmark();
    this.wsElapsedTime += this.runWasmBenchmark();
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

  checkFunctionality(): boolean {
    if (!this.videoCanvasDataInited) {
      this.initVideoCanvasData();
      this.videoCanvasDataInited = true;
    }

    const markers1 = this.runJavaScript();
    const markers2 = this.runWasm();
    this.renderDetection(this.jsContext, markers1);
    this.renderDetection(this.wsContext, markers2);
    return this.equalMarkers(markers1, markers2);
  }

  runWasm(): any {
    const result = this.module._detect(
      this.pointer0,
      this.pointer1,
      this.width,
      this.height,
    );

    const markers = [];
    let pos = result / 4;
    const data = this.module.HEAP32;
    const num = data[pos++];
    for (let i = 0; i < num; i++) {
      markers[i] = new AR.Marker(data[pos++], [
        { x: data[pos++], y: data[pos++] },
        { x: data[pos++], y: data[pos++] },
        { x: data[pos++], y: data[pos++] },
        { x: data[pos++], y: data[pos++] },
      ]);
    }

    this.module._freeResult(result);

    return markers;
  }

  runJavaScript(): void {
    if (this._detector === undefined) {
      this._detector = new AR.Detector(this.width, this.height);
    }
    return this._detector.detect(
      new CV.Image(this.width, this.height, this.videoDataArray),
    );
  }

  runJavaScriptBenchmark(): any {
    const loop = 1;
    let elapsedTime = 0.0;
    let markers;
    for (let i = 0; i < loop; i++) {
      let startTime = performance.now();
      markers = this.runJavaScript();
      let endTime = performance.now();
      elapsedTime += endTime - startTime;
    }
    this.renderDetection(this.jsContext, markers);
    return elapsedTime / loop;
  }

  runWasmBenchmark(): any {
    const loop = 1;
    let elapsedTime = 0.0;
    let markers;
    for (let i = 0; i < loop; i++) {
      let startTime = performance.now();
      markers = this.runWasm();
      let endTime = performance.now();
      elapsedTime += endTime - startTime;
    }
    this.renderDetection(this.wsContext, markers);
    return elapsedTime / loop;
  }

  initVideoCanvasData(): void {
    this.pointer0 = this.module._newARDetector(this.width, this.height); // ARDetector
    this.pointer1 = this.module._malloc(this.length); // input image pixels array
    this.videoDataArray = this.module.HEAPU8.subarray(
      this.pointer1,
      this.pointer1 + this.length,
    );
    this.updateOriginalImageData();
  }

  equalMarkers(markers1: any, markers2: any) {
    if (markers1.length !== markers2.length) return false;
    for (let i = 0, il = markers1.length; i < il; i++) {
      let marker1 = markers1[i];
      let marker2 = markers2[i];
      if (marker1.id !== marker2.id) return false;
      for (let j = 0; j < 4; j++) {
        if (marker1.corners[j].x !== marker2.corners[j].x) return false;
        if (marker1.corners[j].y !== marker2.corners[j].y) return false;
      }
    }
    return true;
  }

  renderDetection(context: any, markers: any) {
    context.clearRect(0, 0, this.width, this.height);
    for (let i = 0, il = markers.length; i < il; i++) {
      let marker = markers[i];
      let corners = marker.corners;
      context.beginPath();
      context.strokeStyle = 'red';
      context.lineWidth = 5;
      context.moveTo(corners[0].x, corners[0].y);
      for (let j = 1; j < 4; j++) {
        context.lineTo(corners[j].x, corners[j].y);
      }
      context.lineTo(corners[0].x, corners[0].y);
      context.closePath();
      context.stroke();
    }
  }
}
