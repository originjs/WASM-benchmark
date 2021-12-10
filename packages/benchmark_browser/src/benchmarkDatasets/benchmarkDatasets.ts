// @ts-ignore
import collisionDetectionModule from '../../c_glue_files/collisionDetection';
import collisionDetectionWasmTest from '../../../benchmark_base/src/benchmarkTests/collisionDetectionWasmTest';
// @ts-ignore
import fibModule from '../../c_glue_files/fib';
import fibWasmTest from '../../../benchmark_base/src/benchmarkTests/fibWasmTest';
// @ts-ignore
import imageConvoluteModule from '../../c_glue_files/imageConvolute';
import imageConvoluteWasmTest from '../../../benchmark_base/src/benchmarkTests/imageConvoluteWasmTest';
// @ts-ignore
import imageGrayscaleModule from '../../c_glue_files/imageGrayscale';
import imageGrayscaleWasmTest from '../../../benchmark_base/src/benchmarkTests/imageGrayscaleWasmTest';
// @ts-ignore
import imageThresholdModule from '../../c_glue_files/imageThreshold';
import imageThresholdWasmTest from '../../../benchmark_base/src/benchmarkTests/imageThresholdWasmTest';
// @ts-ignore
import multiplyDoubleModule from '../../c_glue_files/multiplyDouble';
import multiplyDoubleWasmTest from '../../../benchmark_base/src/benchmarkTests/multiplyDoubleWasmTest';
// @ts-ignore
import multiplyIntVecModule from '../../c_glue_files/multiplyIntVec';
import multiplyIntVecWasmTest from '../../../benchmark_base/src/benchmarkTests/multiplyIntVecWasmTest';
// @ts-ignore
import multiplyDoubleVecModule from '../../c_glue_files/multiplyDoubleVec';
import multiplyDoubleVecWasmTest from '../../../benchmark_base/src/benchmarkTests/multiplyDoubleVecWasmTest';
// @ts-ignore
import quicksortIntModule from '../../c_glue_files/quicksortInt';
import quicksortIntWasmTest from '../../../benchmark_base/src/benchmarkTests/quicksortIntWasmTest';
// @ts-ignore
import quicksortDoubleModule from '../../c_glue_files/quicksortDouble';
import quicksortDoubleWasmTest from '../../../benchmark_base/src/benchmarkTests/quicksortDoubleWasmTest';
// @ts-ignore
import sumIntModule from '../../c_glue_files/sumInt';
import sumIntWasmTest from '../../../benchmark_base/src/benchmarkTests/sumIntWasmTest';
// @ts-ignore
import sumDoubleModule from '../../c_glue_files/sumDouble';
import sumDoubleWasmTest from '../../../benchmark_base/src/benchmarkTests/sumDoubleWasmTest';
import videoConvoluteWasmTest from '../../../benchmark_base/src/benchmarkTests/videoConvoluteWasmTest';
import videoGrayscaleWasmTest from '../../../benchmark_base/src/benchmarkTests/videoGrayscaleWasmTest';
// @ts-ignore
import videoMarkerDetectionModule from '../../c_glue_files/markerDetection';
import videoMarkerDetectionWasmTest from '../../../benchmark_base/src/benchmarkTests/videoMarkerDetectionWasmTest';
import videoThresholdWasmTest from '../../../benchmark_base/src/benchmarkTests/videoThresholdWasmTest';

const benchmarkDatasets = {
  collisionDetection: {
    cGlueFunc: collisionDetectionModule,
    cWasmUrl: '/c_wasm_files/collisionDetection.wasm',
    testbench: collisionDetectionWasmTest,
    dataSize: 0x4000,
  },
  fibonacci: {
    cGlueFunc: fibModule,
    cWasmUrl: '/c_wasm_files/fib.wasm',
    rustWasmUrl: '/rust_wasm_files/fibRust.wasm',
    testbench: fibWasmTest,
    dataSize: 0x28,
  },
  imageConvolute: {
    cGlueFunc: imageConvoluteModule,
    cWasmUrl: '/c_wasm_files/imageConvolute.wasm',
    testbench: imageConvoluteWasmTest,
    image: '/src/assets/image.jpg',
  },
  imageGrayscale: {
    cGlueFunc: imageGrayscaleModule,
    cWasmUrl: '/c_wasm_files/imageGrayscale.wasm',
    testbench: imageGrayscaleWasmTest,
    image: '/src/assets/image.jpg',
  },
  imageThreshold: {
    cGlueFunc: imageThresholdModule,
    cWasmUrl: '/c_wasm_files/imageThreshold.wasm',
    testbench: imageThresholdWasmTest,
    image: '/src/assets/image.jpg',
  },
  multiplyDouble: {
    cGlueFunc: multiplyDoubleModule,
    cWasmUrl: '/c_wasm_files/multiplyDouble.wasm',
    rustWasmUrl: '/rust_wasm_files/multiplyDoubleRust.wasm',
    testbench: multiplyDoubleWasmTest,
    dataSize: 0x10000000,
  },
  multiplyIntVec: {
    cGlueFunc: multiplyIntVecModule,
    cWasmUrl: '/c_wasm_files/multiplyIntVec.wasm',
    testbench: multiplyIntVecWasmTest,
    dataSize: 0x2000000,
  },
  multiplyDoubleVec: {
    cGlueFunc: multiplyDoubleVecModule,
    cWasmUrl: '/c_wasm_files/multiplyDoubleVec.wasm',
    testbench: multiplyDoubleVecWasmTest,
    dataSize: 0x2000000,
  },
  quicksortInt: {
    cGlueFunc: quicksortIntModule,
    cWasmUrl: '/c_wasm_files/quicksortInt.wasm',
    testbench: quicksortIntWasmTest,
    dataSize: 0x200000,
  },
  quicksortDouble: {
    cGlueFunc: quicksortDoubleModule,
    cWasmUrl: '/c_wasm_files/quicksortDouble.wasm',
    testbench: quicksortDoubleWasmTest,
    dataSize: 0x200000,
  },
  sumInt: {
    cGlueFunc: sumIntModule,
    cWasmUrl: '/c_wasm_files/sumInt.wasm',
    testbench: sumIntWasmTest,
    dataSize: 0x8000000,
  },
  sumDouble: {
    cGlueFunc: sumDoubleModule,
    cWasmUrl: '/c_wasm_files/sumDouble.wasm',
    testbench: sumDoubleWasmTest,
    dataSize: 0x4000000,
  },
  videoConvolute: {
    Module: imageConvoluteModule,
    testbench: videoConvoluteWasmTest,
    url: '/c_wasm_files/imageConvolute.wasm',
    video: '/src/assets/marker.mp4',
  },
  videoGrayscale: {
    Module: imageGrayscaleModule,
    testbench: videoGrayscaleWasmTest,
    url: '/c_wasm_files/imageGrayscale.wasm',
    video: '/src/assets/marker.mp4',
  },
  videoMarkerDetection: {
    Module: videoMarkerDetectionModule,
    testbench: videoMarkerDetectionWasmTest,
    url: '/c_wasm_files/markerDetection.wasm',
    video: '/src/assets/marker.mp4',
  },
  videoThreshold: {
    Module: imageThresholdModule,
    testbench: videoThresholdWasmTest,
    url: '/c_wasm_files/imageThreshold.wasm',
    video: '/src/assets/marker.mp4',
  },
};

export default benchmarkDatasets;
