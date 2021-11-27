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

const benchmarkDatasets = {
  collisionDetection: {
    Module: collisionDetectionModule,
    testbench: collisionDetectionWasmTest,
    url: '/browser_benchmark/collisionDetection.wasm',
    dataSize: 0x4000,
  },
  fibonacci: {
    Module: fibModule,
    testbench: fibWasmTest,
    url: '/browser_benchmark/fib.wasm',
    dataSize: 0x28,
  },
  imageConvolute: {
    Module: imageConvoluteModule,
    testbench: imageConvoluteWasmTest,
    url: '/browser_benchmark/imageConvolute.wasm',
    image: '/src/assets/image.jpg',
  },
  imageGrayscale: {
    Module: imageGrayscaleModule,
    testbench: imageGrayscaleWasmTest,
    url: '/browser_benchmark/imageGrayscale.wasm',
    image: '/src/assets/image.jpg',
  },
  imageThreshold: {
    Module: imageThresholdModule,
    testbench: imageThresholdWasmTest,
    url: '/browser_benchmark/imageThreshold.wasm',
    image: '/src/assets/image.jpg',
  },
  multiplyDouble: {
    Module: multiplyDoubleModule,
    testbench: multiplyDoubleWasmTest,
    url: '/browser_benchmark/multiplyDouble.wasm',
    dataSize: 0x10000000,
  },
  multiplyIntVec: {
    Module: multiplyIntVecModule,
    testbench: multiplyIntVecWasmTest,
    url: '/browser_benchmark/multiplyIntVec.wasm',
    dataSize: 0x2000000,
  },
  multiplyDoubleVec: {
    Module: multiplyDoubleVecModule,
    testbench: multiplyDoubleVecWasmTest,
    url: '/browser_benchmark/multiplyDoubleVec.wasm',
    dataSize: 0x2000000,
  },
  quicksortInt: {
    Module: quicksortIntModule,
    testbench: quicksortIntWasmTest,
    url: '/browser_benchmark/quicksortInt.wasm',
    dataSize: 0x200000,
  },
  quicksortDouble: {
    Module: quicksortDoubleModule,
    testbench: quicksortDoubleWasmTest,
    url: '/browser_benchmark/quicksortDouble.wasm',
    dataSize: 0x200000,
  },
  sumInt: {
    Module: sumIntModule,
    testbench: sumIntWasmTest,
    url: '/browser_benchmark/sumInt.wasm',
    dataSize: 0x8000000,
  },
  sumDouble: {
    Module: sumDoubleModule,
    testbench: sumDoubleWasmTest,
    url: '/browser_benchmark/sumDouble.wasm',
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
};

export default benchmarkDatasets;
