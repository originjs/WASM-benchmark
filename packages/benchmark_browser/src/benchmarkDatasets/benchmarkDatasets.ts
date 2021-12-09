// @ts-ignore
import collisionDetectionModule from '../../browser_benchmark/collisionDetection';
import collisionDetectionWasmTest from '../../../benchmark_base/src/benchmarkTests/collisionDetectionWasmTest';
// @ts-ignore
import fibModule from '../../browser_benchmark/fib';
import fibWasmTest from '../../../benchmark_base/src/benchmarkTests/fibWasmTest';
// @ts-ignore
import imageConvoluteModule from '../../browser_benchmark/imageConvolute';
import imageConvoluteWasmTest from '../../../benchmark_base/src/benchmarkTests/imageConvoluteWasmTest';
// @ts-ignore
import imageGrayscaleModule from '../../browser_benchmark/imageGrayscale';
import imageGrayscaleWasmTest from '../../../benchmark_base/src/benchmarkTests/imageGrayscaleWasmTest';
// @ts-ignore
import imageThresholdModule from '../../browser_benchmark/imageThreshold';
import imageThresholdWasmTest from '../../../benchmark_base/src/benchmarkTests/imageThresholdWasmTest';
// @ts-ignore
import multiplyDoubleModule from '../../browser_benchmark/multiplyDouble';
import multiplyDoubleWasmTest from '../../../benchmark_base/src/benchmarkTests/multiplyDoubleWasmTest';
// @ts-ignore
import multiplyIntVecModule from '../../browser_benchmark/multiplyIntVec';
import multiplyIntVecWasmTest from '../../../benchmark_base/src/benchmarkTests/multiplyIntVecWasmTest';
// @ts-ignore
import multiplyDoubleVecModule from '../../browser_benchmark/multiplyDoubleVec';
import multiplyDoubleVecWasmTest from '../../../benchmark_base/src/benchmarkTests/multiplyDoubleVecWasmTest';
// @ts-ignore
import quicksortIntModule from '../../browser_benchmark/quicksortInt';
import quicksortIntWasmTest from '../../../benchmark_base/src/benchmarkTests/quicksortIntWasmTest';
// @ts-ignore
import quicksortDoubleModule from '../../browser_benchmark/quicksortDouble';
import quicksortDoubleWasmTest from '../../../benchmark_base/src/benchmarkTests/quicksortDoubleWasmTest';
// @ts-ignore
import sumIntModule from '../../browser_benchmark/sumInt';
import sumIntWasmTest from '../../../benchmark_base/src/benchmarkTests/sumIntWasmTest';
// @ts-ignore
import sumDoubleModule from '../../browser_benchmark/sumDouble';
import sumDoubleWasmTest from '../../../benchmark_base/src/benchmarkTests/sumDoubleWasmTest';
import videoConvoluteWasmTest from '../../../benchmark_base/src/benchmarkTests/videoConvoluteWasmTest';
import videoGrayscaleWasmTest from '../../../benchmark_base/src/benchmarkTests/videoGrayscaleWasmTest';
// @ts-ignore
import videoMarkerDetectionModule from '../../browser_benchmark/markerDetection';
import videoMarkerDetectionWasmTest from '../../../benchmark_base/src/benchmarkTests/videoMarkerDetectionWasmTest';
import videoThresholdWasmTest from '../../../benchmark_base/src/benchmarkTests/videoThresholdWasmTest';

const benchmarkDatasets = {
  collisionDetection: {
    cGlueFunc: collisionDetectionModule,
    cWasmUrl: '/browser_benchmark/collisionDetection.wasm',
    testbench: collisionDetectionWasmTest,
    dataSize: 0x4000,
  },
  fibonacci: {
    cGlueFunc: fibModule,
    cWasmUrl: '/browser_benchmark/fib.wasm',
    testbench: fibWasmTest,
    dataSize: 0x28,
  },
  imageConvolute: {
    cGlueFunc: imageConvoluteModule,
    cWasmUrl: '/browser_benchmark/imageConvolute.wasm',
    testbench: imageConvoluteWasmTest,
    image: '/src/assets/image.jpg',
  },
  imageGrayscale: {
    cGlueFunc: imageGrayscaleModule,
    cWasmUrl: '/browser_benchmark/imageGrayscale.wasm',
    testbench: imageGrayscaleWasmTest,
    image: '/src/assets/image.jpg',
  },
  imageThreshold: {
    cGlueFunc: imageThresholdModule,
    cWasmUrl: '/browser_benchmark/imageThreshold.wasm',
    testbench: imageThresholdWasmTest,
    image: '/src/assets/image.jpg',
  },
  multiplyDouble: {
    cGlueFunc: multiplyDoubleModule,
    cWasmUrl: '/browser_benchmark/multiplyDouble.wasm',
    rustWasmUrl: '/rust_wasm_files/multiplyDoubleRust.wasm',
    testbench: multiplyDoubleWasmTest,
    dataSize: 0x10000000,
  },
  multiplyIntVec: {
    cGlueFunc: multiplyIntVecModule,
    cWasmUrl: '/browser_benchmark/multiplyIntVec.wasm',
    testbench: multiplyIntVecWasmTest,
    dataSize: 0x2000000,
  },
  multiplyDoubleVec: {
    cGlueFunc: multiplyDoubleVecModule,
    cWasmUrl: '/browser_benchmark/multiplyDoubleVec.wasm',
    testbench: multiplyDoubleVecWasmTest,
    dataSize: 0x2000000,
  },
  quicksortInt: {
    cGlueFunc: quicksortIntModule,
    cWasmUrl: '/browser_benchmark/quicksortInt.wasm',
    testbench: quicksortIntWasmTest,
    dataSize: 0x200000,
  },
  quicksortDouble: {
    cGlueFunc: quicksortDoubleModule,
    cWasmUrl: '/browser_benchmark/quicksortDouble.wasm',
    testbench: quicksortDoubleWasmTest,
    dataSize: 0x200000,
  },
  sumInt: {
    cGlueFunc: sumIntModule,
    cWasmUrl: '/browser_benchmark/sumInt.wasm',
    testbench: sumIntWasmTest,
    dataSize: 0x8000000,
  },
  sumDouble: {
    cGlueFunc: sumDoubleModule,
    cWasmUrl: '/browser_benchmark/sumDouble.wasm',
    testbench: sumDoubleWasmTest,
    dataSize: 0x4000000,
  },
  videoConvolute: {
    Module: imageConvoluteModule,
    testbench: videoConvoluteWasmTest,
    url: '/browser_benchmark/imageConvolute.wasm',
    video: '/src/assets/marker.mp4',
  },
  videoGrayscale: {
    Module: imageGrayscaleModule,
    testbench: videoGrayscaleWasmTest,
    url: '/browser_benchmark/imageGrayscale.wasm',
    video: '/src/assets/marker.mp4',
  },
  videoMarkerDetection: {
    Module: videoMarkerDetectionModule,
    testbench: videoMarkerDetectionWasmTest,
    url: '/browser_benchmark/markerDetection.wasm',
    video: '/src/assets/marker.mp4',
  },
  videoThreshold: {
    Module: imageThresholdModule,
    testbench: videoThresholdWasmTest,
    url: '/browser_benchmark/imageThreshold.wasm',
    video: '/src/assets/marker.mp4',
  },
};

export default benchmarkDatasets;
