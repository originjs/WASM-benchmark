<template>
  <div style="width: 70%; border: 1px solid; border-radius: 15px">
    <div style="border-bottom: 1px solid">
      <h3>Configure:</h3>
      <p>
        <button
          :disabled="btnDisabled"
          @click="btnClicked()"
          style="font-size: 15px"
        >
          {{ btnMessage }}
        </button>
      </p>
    </div>
    <br />
    <div>
      <h3>Results:</h3>
      <p>
        <span
          >Status : <code>{{ message }}</code></span
        >
      </p>
      <p>
        JavaScript(average [ms]): <span>{{ jsPerformance }}</span>
      </p>
      <p>
        WebAssembly(average [ms]): <span>{{ wsPerformance }}</span>
      </p>
      <p>
        JavaScript/WebAssembly: <span>{{ comparison }}</span>
      </p>
    </div>
  </div>
</template>
<script>
import { reactive, ref } from 'vue';
import { loadEmccCompiledWasm } from '@/utils/loadWasmUtils';

export default {
  name: 'benchmarkTest',
  props: {
    benchmarkDataset: Object,
  },
  data() {
    return {
      message: 'Ready',
      btnMessage: 'Run Benchmark',
      btnDisabled: false,
      comparison: '',
      benchmarkName: 'JavaScript ',
      jsPerformance: '',
      wsPerformance: '',
      benchmarkRunning: false,
    };
  },
  async setup(props) {
    const warmUpRunLoops = 1;
    const benchmarkRunLoops = 10;
    let module = ref({});
    let wasmTest = {};

    module = await loadEmccCompiledWasm(
      props.benchmarkDataset.url,
      props.benchmarkDataset.Module,
    );
    wasmTest = new props.benchmarkDataset.testbench(
      props.benchmarkDataset.dataSize,
      warmUpRunLoops,
      benchmarkRunLoops,
      module,
      props.benchmarkDataset.dom,
      props.benchmarkDataset.jsCanvas,
      props.benchmarkDataset.wsCanvas,
    );
    return { module, wasmTest };
  },
  methods: {
    startRendering() {
      this.wasmTest.render(this);
      if (this.benchmarkRunning) {
        requestAnimationFrame(this.startRendering);
      }
    },
    btnClicked() {
      this.benchmarkRunning = !this.benchmarkRunning;
      if (!this.benchmarkRunning) {
        this.message = 'Stopped';
        this.btnMessage = 'Run Benchmark';
        return;
      }

      this.btnMessage = 'Stop Benchmark';
      const that = this;
      setTimeout(function () {
        if (!that.wasmTest.checkFunctionality()) {
          that.message = 'Two functions seem not equal';
          that.btnDisabled = false;
          return;
        }
        that.startRendering();
        that.message = 'Running';
      });

      that.message = 'Checking equality';
    },
  },
};
</script>
<style scoped></style>
