import{i as y}from"./__vite-wasm-helper.868871dd.js";var v=e=>y(e,"/WASM-benchmark/assets/multiplyDoubleVecRust.cc21e99f.wasm");const a=await v();let r=null;function _(){return(r===null||r.buffer!==a.memory.buffer)&&(r=new Float64Array(a.memory.buffer)),r}let n=0;function m(e,o){const t=o(e.length*8);return _().set(e,t/8),n=e.length,t}function d(e,o,t,u){try{var s=m(e,a.__wbindgen_malloc),c=n,f=m(o,a.__wbindgen_malloc),b=n,l=m(t,a.__wbindgen_malloc),i=n;a.multiply_double_vec(s,c,f,b,l,i,u)}finally{t.set(_().subarray(l/8,l/8+i)),a.__wbindgen_free(l,i*8)}}export{d as multiply_double_vec};
