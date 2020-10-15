<template>
  <div class="loader" v-show="loading">
    <div class="spinner"></div>
  </div>
  <TempGauge/>
  <LoadChart/>
  <Speedometer/>

<!--  <button @click="refresh()">Refresh</button>-->
<!--  <button @click="cancelAutoUpdate()">Cancel</button>-->
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

import LoadChart from "@/components/LoadChart";
import Speedometer from "@/components/Speedometer";
import TempGauge from "@/components/TempGauge";

export default {
  name: 'App',
  components: {
    TempGauge,
    Speedometer,
    LoadChart,
  },
  data() {
    return {
      timer: ''
    }
  },
  setup() {
    const store = useStore();
    const loading = computed(() => store.state.loading);
    const monitor = computed(() => store.state.monitor);
    function refresh() {
      store.dispatch('refresh');
    }
    refresh();
    return { loading, monitor, refresh };
  },
  methods: {
    cancelAutoUpdate () { clearInterval(this.timer) }
  },
  mounted () {
    this.timer = setInterval(this.refresh, 5000);
  }
};
</script>

<style>
body, html {
  margin: 0;
  padding: 0;
  background: radial-gradient(circle, rgb(1,17,43) 30%, rgb(0,0,0) 100%);
}
#app {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  position: relative;
  background-image: radial-gradient(circle at 1px 1px, rgb(70,70,70) 1px, transparent 0);
  background-position: 10px 10px;
  background-size: 30px 30px;
  width: 100vw;
  height: 100vw;
  overflow:hidden;
  color: white;
}
.loader {
  position:absolute;
  right:2vw;
  top:2vw;
  animation: fadeIn ease 2s;
}
.spinner {
  border: 2vw solid #ffffff44;
  border-radius: 50%;
  border-top: 2vw solid #a2dcf199;
  width: 4vw;
  height: 4vw;
  animation: spin 1.5s linear infinite;
}
@keyframes fadeIn {
  0% {opacity:0;}
  100% {opacity:1;}
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
