let imports = {};
let wasm;

/**
 * @param {number} a
 * @param {number} b
 * @param {number} n
 * @returns {number}
 */
module.exports.multiply_double = function (a, b, n) {
  var ret = wasm.multiply_double(a, b, n);
  return ret;
};

const path = require('path').join(__dirname, 'multiplyDoubleRust.wasm');
const bytes = require('fs').readFileSync(path);

const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
wasm = wasmInstance.exports;
module.exports.__wasm = wasm;
