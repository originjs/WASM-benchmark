var r=async(s={},i)=>{let a;if(i.startsWith("data:")){const t=atob(i.replace(/^data:.*?base64,/,"")),n=new Uint8Array(t.length);for(let e=0;e<t.length;e++)n[e]=t.charCodeAt(e);a=await WebAssembly.instantiate(n,s)}else{const t=await fetch(i),n=t.headers.get("Content-Type")||"";if("instantiateStreaming"in WebAssembly&&n.startsWith("application/wasm"))a=await WebAssembly.instantiateStreaming(t,s);else{const e=await t.arrayBuffer();a=await WebAssembly.instantiate(e,s)}}return a.instance.exports};export{r as i};