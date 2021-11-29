<template>
  <div style="width: 70%; border: 1px solid; border-radius: 15px">
    <div style="border-bottom: 1px solid">
      <h3>Configure:</h3>
      <p>
        Warm-up run loops:
        <input
          style="width: 50px; text-align: center"
          v-model="wasmTest.warmUpRunLoops"
        />
      </p>
      <p>
        Benchmark run loops:
        <input
          style="width: 50px; text-align: center"
          v-model="wasmTest.benchmarkRunLoops"
        />
      </p>
      <p>
        <button
          :disabled="btnDisabled"
          @click="start()"
          style="font-size: 15px"
        >
          Run Benchmark
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
import { ref } from 'vue';
import { loadEmccCompiledWasm } from '../utils/loadWasmUtils';

export default {
  name: 'benchmarkTest',
  props: {
    benchmarkDataset: Object,
  },
  data() {
    return {
      message: 'Ready',
      btnDisabled: false,
      jsPerformance: '',
      wsPerformance: '',
      comparison: '',
      benchmarkName: 'JavaScript ',
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
    start() {
      Promise.resolve(1).then(() => {
        if (!this.wasmTest.checkFunctionality()) {
          this.message = 'Two functions seem not equal';
          this.btnDisabled = false;
          return;
        }

        Promise.resolve(1).then(() => {
          this.jsPerformance = this.wasmTest.runJavaScriptBenchmark();
          Promise.resolve(1).then(() => {
            this.wsPerformance = this.wasmTest.runWasmBenchmark();
            this.comparison = (this.jsPerformance / this.wsPerformance).toFixed(
              4,
            );
            this.message = 'Done';
          });
          this.message = 'Running WebAssembly';
        });
        this.message = 'Running JavaScript';
      });
      this.message = 'Checking equality';
    },
  },
};
</script>
<style scoped></style>
