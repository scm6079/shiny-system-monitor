<template>
  <section>
    <div>CPU {{ cpuSpeed }}</div>
    <div>GPU {{ gpuSpeed }}</div>
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
