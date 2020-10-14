<template>
  <section>
    <div>CPU {{ cpuSpeed.toLocaleString() }} MHz</div>
    <div>GPU {{ gpuSpeed.toLocaleString() }} MHz</div>


<!--<svg-->
<!--    xmlns="http://www.w3.org/2000/svg"-->
<!--    xmlns:xlink="http://www.w3.org/1999/xlink"-->
<!--    width="333px" height="333px">-->
<!--  <path fill-rule="evenodd"  stroke="rgb(255, 255, 255)" stroke-width="4px" stroke-linecap="butt" stroke-linejoin="miter" opacity="0.451" fill="none"-->
<!--        d="M165.692,2.615 C255.821,2.615 328.885,75.679 328.885,165.808 C328.885,255.936 255.821,329.000 165.692,329.000 C75.564,329.000 2.500,255.936 2.500,165.808 C2.500,75.679 75.564,2.615 165.692,2.615 Z"/>-->
<!--</svg>-->

<!--<svg-->
<!--    xmlns="http://www.w3.org/2000/svg"-->
<!--    xmlns:xlink="http://www.w3.org/1999/xlink"-->
<!--    width="330px" height="330px">-->
<!--  <path fill-rule="evenodd"  stroke="rgb(41, 94, 123)" stroke-width="20px" stroke-linecap="butt" stroke-linejoin="miter" fill="none"-->
<!--        d="M159.692,10.361 C242.229,10.361 309.139,77.270 309.139,159.808 C309.139,242.345 242.229,309.254 159.692,309.254 C77.155,309.254 10.246,242.345 10.246,159.808 C10.246,77.270 77.155,10.361 159.692,10.361 Z"/>-->
<!--</svg>-->


  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Speedometer',
  props: {
    msg: String
  },
  computed: {
    ...mapState(['monitor']),
    ...mapGetters({
      cpuSpeed: 'cpuSpeed',
      gpuSpeed: 'gpuSpeed',
    }),

  },
}
</script>

<style scoped>
section {
  border: 1px solid deepskyblue;
  position: absolute;
  width: calc(49vw - 2px);
  height: calc(30vw - 2px);
  left: 51vw;
  top: 70vw;

  font-size: 5vw;
}
</style>
