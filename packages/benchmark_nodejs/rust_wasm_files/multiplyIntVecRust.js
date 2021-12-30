let imports = {};
let wasm;

let cachegetUint32Memory0 = null;
function getUint32Memory0() {
  if (
    cachegetUint32Memory0 === null ||
    cachegetUint32Memory0.buffer !== wasm.memory.buffer
  ) {
    cachegetUint32Memory0 = new Uint32Array(wasm.memory.buffer);
  }
  return cachegetUint32Memory0;
}

let WASM_VECTOR_LEN = 0;

function passArray32ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 4);
  getUint32Memory0().set(arg, ptr / 4);
  WASM_VECTOR_LEN = arg.length;
  return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
  if (
    cachegetInt32Memory0 === null ||
    cachegetInt32Memory0.buffer !== wasm.memory.buffer
  ) {
    cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
  }
  return cachegetInt32Memory0;
}
/**
 * @param {Int32Array} src1
 * @param {Int32Array} src2
 * @param {Int32Array} res
 * @param {number} n
 */
module.exports.multiply_int_vec = function (src1, src2, res, n) {
  try {
    var ptr0 = passArray32ToWasm0(src1, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passArray32ToWasm0(src2, wasm.__wbindgen_malloc);
    var len1 = WASM_VECTOR_LEN;
    var ptr2 = passArray32ToWasm0(res, wasm.__wbindgen_malloc);
    var len2 = WASM_VECTOR_LEN;
    wasm.multiply_int_vec(ptr0, len0, ptr1, len1, ptr2, len2, n);
  } finally {
    res.set(getInt32Memory0().subarray(ptr2 / 4, ptr2 / 4 + len2));
    wasm.__wbindgen_free(ptr2, len2 * 4);
  }
};

const path = require('path').join(__dirname, 'multiplyIntVecRust.wasm');
const bytes = require('fs').readFileSync(path);

const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
wasm = wasmInstance.exports;
module.exports.__wasm = wasm;
