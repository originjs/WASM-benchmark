<template>
  <div>
    <img
      alt="Origin.js logo"
      src="../assets/originjs.png"
      class="logo logo-large"
    />
    <h3 class="text-h3">
      A simple WebAssembly benchmark built with Vue3 & Vite
    </h3>
    <h4 class="text-h4">
      This benchmark is ported from  <a href="https://github.com/takahirox/WebAssembly-benchmark">takahirox's WebAssembly-benchmark</a>.
    </h4>
    <router-view />
  </div>
</template>

<script>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'Default',
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
