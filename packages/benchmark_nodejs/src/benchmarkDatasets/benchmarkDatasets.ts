// @ts-ignore
import collisionDetectionModule from '../../browser_benchmark/collisionDetection';
import collisionDetectionWasmTest from '../../../benchmark_base/src/benchmarkTests/collisionDetectionWasmTest';

const benchmarkDatasets = {
  collisionDetection: {
    Module: collisionDetectionModule,
    testbench: collisionDetectionWasmTest,
    url: './browser_benchmark/collisionDetection.wasm',
    dataSize: 0x4000,
  },
};

export default benchmarkDatasets;
