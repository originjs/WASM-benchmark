let imports = {};
let wasm;

/**
 * @param {number} n
 * @returns {number}
 */
module.exports.fib = function (n) {
  var ret = wasm.fib(n);
  return ret >>> 0;
};

const path = require('path').join(__dirname, 'fibRust.wasm');
const bytes = require('fs').readFileSync(path);

const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
wasm = wasmInstance.exports;
module.exports.__wasm = wasm;
