<template>
  <div>
    TEMP GAUGE TODO
    monitor: {{monitor}}
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'TempGauge',
  props: {
    msg: String
  },
  computed: {
    ...mapState(['monitor'])
  },
}
</script>

<style scoped>

</style>
