import multiply_double from '../../rust_wasm/multiplyDouble'
import multiplyDoubleWasmTest from '../benchmarkTests/multiplyDoubleWasmTest'

const benchmarkDatasets = {
  multiplyDouble: {
    testbench: multiplyDoubleWasmTest,
    rustWasmFunc: multiply_double,
    dataSize: 0x10000000,
  },
};

export default benchmarkDatasets;
