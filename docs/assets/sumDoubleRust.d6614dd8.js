import{i as m}from"./__vite-wasm-helper.868871dd.js";var u=e=>m(e,"/WASM-benchmark/assets/sumDoubleRust.a40150b6.wasm");const r=await u();let n=null;function i(){return(n===null||n.buffer!==r.memory.buffer)&&(n=new Float64Array(r.memory.buffer)),n}let o=0;function f(e,a){const t=a(e.length*8);return i().set(e,t/8),o=e.length,t}function c(e,a){var t=f(e,r.__wbindgen_malloc),s=o,l=r.sum_double(t,s,a);return l}export{c as sum_double};
