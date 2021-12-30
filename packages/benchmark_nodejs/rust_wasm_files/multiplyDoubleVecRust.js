let imports = {};
let wasm;

let cachegetFloat64Memory0 = null;
function getFloat64Memory0() {
  if (
    cachegetFloat64Memory0 === null ||
    cachegetFloat64Memory0.buffer !== wasm.memory.buffer
  ) {
    cachegetFloat64Memory0 = new Float64Array(wasm.memory.buffer);
  }
  return cachegetFloat64Memory0;
}

let WASM_VECTOR_LEN = 0;

function passArrayF64ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 8);
  getFloat64Memory0().set(arg, ptr / 8);
  WASM_VECTOR_LEN = arg.length;
  return ptr;
}
/**
 * @param {Float64Array} src1
 * @param {Float64Array} src2
 * @param {Float64Array} res
 * @param {number} n
 */
module.exports.multiply_double_vec = function (src1, src2, res, n) {
  try {
    var ptr0 = passArrayF64ToWasm0(src1, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passArrayF64ToWasm0(src2, wasm.__wbindgen_malloc);
    var len1 = WASM_VECTOR_LEN;
    var ptr2 = passArrayF64ToWasm0(res, wasm.__wbindgen_malloc);
    var len2 = WASM_VECTOR_LEN;
    wasm.multiply_double_vec(ptr0, len0, ptr1, len1, ptr2, len2, n);
  } finally {
    res.set(getFloat64Memory0().subarray(ptr2 / 8, ptr2 / 8 + len2));
    wasm.__wbindgen_free(ptr2, len2 * 8);
  }
};

const path = require('path').join(__dirname, 'multiplyDoubleVecRust.wasm');
const bytes = require('fs').readFileSync(path);

const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
wasm = wasmInstance.exports;
module.exports.__wasm = wasm;
