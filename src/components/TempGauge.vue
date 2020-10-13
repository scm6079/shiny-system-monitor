<template>
  <section>
    <div>CPU {{ cpuTemp }}&deg; C</div>
    <div>GPU {{ gpuTemp }}&deg; C</div>
    <div>FAN SPEED {{ fanSpeed.toLocaleString() }} RPM</div>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'TempGauge',
  props: {
    msg: String
  },
  computed: {
    ...mapState(['monitor']),
    ...mapGetters({
      cpuTemp: 'cpuTemp',
      gpuTemp: 'gpuTemp',
      fanSpeed: 'fanSpeed',
    })
  },
}
</script>

<style scoped>
section {
  border: 1px solid red;
  padding: 10px;
  margin: 10px;
}
</style>
