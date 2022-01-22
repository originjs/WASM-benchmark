<template>
  <div style="width: 100%">
    <h1 style="margin-top: 3rem">Benchmark : {{ $route.params.benchmark }}</h1>
    <div v-if="getImage()">
      <button
        style="font-size: 15px; margin-bottom: 25px"
        @click="toggleImages"
      >
        {{ toggleImagesString }}
      </button>
      <div
        v-show="displayImages"
        style="
          display: flex;
          justify-content: space-around;
          margin-bottom: 25px;
        "
      >
        <div>
          <p>Original Image:</p>
          <img
            style="width: calc(30vw)"
            @load="onDomLoad"
            ref="image"
            :src="getImage()"
          />
        </div>
        <div>
          <p>JavaScript Result:</p>
          <canvas
            style="width: calc(30vw); border: 1px solid"
            ref="js_image_canvas"
          ></canvas>
        </div>
        <div>
          <p>WASM Result:</p>
          <canvas
            style="width: calc(30vw); border: 1px solid"
            ref="ws_image_canvas"
          ></canvas>
        </div>
      </div>
    </div>
    <div v-if="getVideo()">
      <button
        style="font-size: 15px; margin-bottom: 25px"
        @click="toggleVideos"
      >
        {{ toggleVideosString }}
      </button>
      <div
        v-show="displayVideos"
        style="
          display: flex;
          justify-content: space-around;
          margin-bottom: 25px;
        "
      >
        <div>
          <p>Original Video:</p>
          <video
            loop
            autoplay
            muted
            @playing="onDomLoad"
            ref="video"
            :src="getVideo()"
          />
        </div>
        <div>
          <p>JavaScript Result:</p>
          <canvas
            style="width: 482px; height: 296px; border: 1px solid"
            ref="js_video_canvas"
          ></canvas>
        </div>
        <div>
          <p>WASM Result:</p>
          <canvas style="border: 1px solid" ref="ws_video_canvas"></canvas>
        </div>
      </div>
    </div>
    <div style="width: 100%; display: flex; justify-content: center">
      <ul
        style="
          margin-left: 5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: left;
        "
      >
        <li v-for="testName in testNames">
          <router-link
            class="text-router-link"
            :to="'/benchmark/browser/' + testName"
            >{{ testName }}</router-link
          >
        </li>
      </ul>
      <div
        style="
          width: 100%;
          margin-left: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
        "
      >
        <div
          v-if="shouldLoadWasm"
          style="display: flex; justify-content: center"
        >
          <suspense :timeout="0">
            <template #default>
              <VideoBenchmarkTest
                v-if="getVideo()"
                :key="$route.params.benchmark"
                :benchmarkDataset="getBenchmarkDataset()"
              />
              <BenchmarkTest
                v-else
                :key="$route.params.benchmark"
                :benchmarkDataset="getBenchmarkDataset()"
              />
            </template>
            <template #fallback>
              <h2>Loading WASM</h2>
            </template>
          </suspense>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, Suspense } from 'vue';
import benchmarkDatasets from '../../../benchmarkDatasets/benchmarkDatasets';
export default {
  name: 'benchmark',
  data() {
    return {
      shouldLoadWasm:
        !this.getBenchmarkDataset().image && !this.getBenchmarkDataset().video,
      toggleImagesString: '- images',
      displayImages: true,
      toggleVideosString: '- videos',
      displayVideos: true,
    };
  },
  setup() {
    const image = ref(null);
    const video = ref(null);
    const js_image_canvas = ref(null);
    const ws_image_canvas = ref(null);
    const js_video_canvas = ref(null);
    const ws_video_canvas = ref(null);
    const testNames = [
      'collisionDetection',
      'fibonacci',
      'imageConvolute',
      'imageGrayscale',
      'imageThreshold',
      'multiplyDouble',
      'multiplyIntVec',
      'multiplyDoubleVec',
      'quicksortInt',
      'quicksortDouble',
      'sumInt',
      'sumDouble',
      'videoConvolute',
      'videoGrayscale',
      'videoMarkerDetection',
      'videoThreshold',
      'md5',
      'sha1',
      'sha3'
    ];

    return {
      testNames,
      benchmarkDatasets,
      image,
      video,
      js_image_canvas,
      ws_image_canvas,
      js_video_canvas,
      ws_video_canvas,
    };
  },
  components: {
    Suspense,
  },
  methods: {
    getBenchmarkDataset() {
      const benchmarkName = this.$route.params.benchmark;
      if (benchmarkDatasets[benchmarkName]) {
        if (benchmarkDatasets[benchmarkName].image) {
          benchmarkDatasets[benchmarkName].dom = this.image;
          benchmarkDatasets[benchmarkName].jsCanvas = this.js_image_canvas;
          benchmarkDatasets[benchmarkName].wsCanvas = this.ws_image_canvas;
        }

        if (benchmarkDatasets[benchmarkName].video) {
          benchmarkDatasets[benchmarkName].dom = this.video;
          benchmarkDatasets[benchmarkName].jsCanvas = this.js_video_canvas;
          benchmarkDatasets[benchmarkName].wsCanvas = this.ws_video_canvas;
        }
        return benchmarkDatasets[benchmarkName];
      }

      // default benchmark
      return benchmarkDatasets.collisionDetection;
    },
    onDomLoad() {
      this.shouldLoadWasm = true;
    },
    getImage() {
      return this.getBenchmarkDataset().image;
    },
    getVideo() {
      return this.getBenchmarkDataset().video;
    },
    toggleImages() {
      this.displayImages = !this.displayImages;
      if (this.displayImages) {
        this.toggleImagesString = '- images';
      } else {
        this.toggleImagesString = '+ images';
      }
    },
    toggleVideos() {
      this.displayVideos = !this.displayVideos;
      if (this.displayVideos) {
        this.toggleVideoString = '- videos';
      } else {
        this.toggleVideoString = '+ videos';
      }
    },
  },
};
</script>
<layout>
layout: profile
</layout>
