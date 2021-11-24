<template>
  <router-view />
  <h3>This is a JavaScript vs WebAssembly(WASM) benchmark.</h3>
  <h3>The WASM files are written in C/C++ and compiled by emscripten.</h3>
  <div class="logo-box-flex">
    <img
      alt="Origin.js logo"
      src="../assets/originjs.png"
      class="logo logo-small"
    />
    <h4 class="text-h4">Origin.js</h4>
  </div>
</template>

<script>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'Profile',
  setup() {
    const sourceOpitons = reactive([
      {
        title: 'github',
        link: 'https://github.com/originjs/origin.js',
      },
      {
        title: 'docs',
        link: 'https://originjs.github.io/docs/',
      },
    ]);

    const router = useRouter();
    const { currentRoute } = router;

    return { currentRoute, sourceOpitons };
  },
};
</script>
