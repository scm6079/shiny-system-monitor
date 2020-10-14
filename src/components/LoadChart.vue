<template>
  <section>
    <div>CPU Usage {{ cpuUsage }}%</div>
    <div>RAM Usage {{ ramUsage }}%</div>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'LoadChart',
  props: {
    msg: String
  },
  computed: {
    ...mapState(['monitor']),
    ...mapGetters({
      cpuUsage: 'cpuUsage',
      ramUsage: 'ramUsage',
    })
  },
}
</script>

<style scoped>
section {
  border: 1px solid yellow;
  position: absolute;
  width: calc(49vw - 2px);
  height: calc(30vw - 2px);
  left: 0;
  top: 70vw;

  font-size: 5vw;
}
</style>
