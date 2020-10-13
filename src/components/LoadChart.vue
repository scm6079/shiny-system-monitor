<template>
  <section>
    <div>CPU Usage {{ cpuUsage }}</div>
    <div>RAM Usage {{ ramUsage }}</div>
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
  border: 1px solid red;
  padding: 10px;
  margin: 10px;
}
</style>
