<template>
  <section>

    <div id="tempGauge">
      <canvas id="tempCanvas" ref="canvas"></canvas>
      <img src="@/assets/temp-gauge.svg" class="svgBg">
      <img src="@/assets/exclamation-triangle.svg" class="alert">
    </div>
    <div class="tempBox">
      <div class="cpuTemp">CPU {{ cpuTemp }}&deg; c</div>
      <hr>
      <div class="gpuTemp">GPU {{ gpuTemp }}&deg; c</div>
    </div>
    <div class="fanSpeed">
      <img src="@/assets/fan-icon.svg" class="fanIcon">
      <div class="fanRpm">
        {{ fanSpeed.toLocaleString() }} RPM
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'TempGauge',
  props: {
    msg: String
  },
  data() {
    return {
      context: null,
    }
  },
  computed: {
    ...mapState(['monitor']),
    ...mapGetters({
      cpuTemp: 'cpuTemp',
      gpuTemp: 'gpuTemp',
      fanSpeed: 'fanSpeed',
    })
  },
  watch: {
    monitor: function() {
      this.updateCanvas();
    }
  },
  methods: {
    calcPointsCirc: function ( cx,cy, rad, dashLength) {
      let n = rad/dashLength,
          alpha = Math.PI * 2 / n,
          points = [],
          i = -1;
      while( i < n )
      {
        let theta = alpha * i,
            theta2 = alpha * (i+1);

        points.push({x : (Math.cos(theta) * rad) + cx, y : (Math.sin(theta) * rad) + cy, ex : (Math.cos(theta2) * rad) + cx, ey : (Math.sin(theta2) * rad) + cy});
        i+=2;
      }
      return points;
    },
    updateCanvas: function() {
      if( !this.context ) return;

      let w = this.context.canvas.width;
      let h = this.context.canvas.height;
      let stroke = 22;

      let cpuDash = [stroke*3.3, stroke/1.1];
      let cpuRadius = (w/2) - 12;
      let cpuStartAngle = 0.782 * Math.PI;
      let cpuEndAngle = 0.224 * Math.PI;

      let gpuRadius = (w/2) - 68;
      let gpuStartAngle = 0.83 * Math.PI;
      let gpuEndAngle = 0.17 * Math.PI

      // clear everything
      this.context.clearRect(0, 0, w, h);

      // draw CPU ring BG
      this.context.beginPath();
      this.context.arc(w/2, h/1.64, cpuRadius, cpuStartAngle, cpuEndAngle, false);
      this.context.lineWidth = stroke;
      this.context.strokeStyle = '#ffffff1a';
      this.context.setLineDash(cpuDash);
      this.context.stroke();

      // draw CPU ring FG
      this.context.beginPath();
      this.context.arc(w/2, h/1.64, cpuRadius, cpuStartAngle, -0.84 * Math.PI, false);
      this.context.lineWidth = stroke;
      this.context.strokeStyle = '#ff0000';
      this.context.setLineDash(cpuDash);
      this.context.stroke();


      // draw GPU ring
      this.context.beginPath();
      this.context.arc(w/2, h/1.64, gpuRadius, gpuStartAngle, gpuEndAngle, false);
      this.context.lineWidth = stroke;
      this.context.strokeStyle = '#ffffff1a';
      // this.context.setLineDash([1, 0]);
      this.context.setLineDash([stroke*4.6, stroke/0.8]);
      this.context.stroke();


      //this.context.beginPath();
      //this.context.rect(0, 0, w, h);
      //this.context.stroke();


    }
  },
  mounted() {
    if( this.$refs.canvas ) {
      let height = this.$refs.canvas.clientHeight;
      let width = this.$refs.canvas.clientWidth;

      let canvas = this.$refs.canvas;
      this.context = canvas.getContext('2d');
      this.context.canvas.height = height;
      this.context.canvas.width = width;

      this.updateCanvas();
    }

  },
}
</script>

<style scoped>
#tempGauge {
  position: absolute;
  margin-top:4vw;
  margin-left:12vw;

  width:76vw;
  height:62vw;
}
.alert {
  position: absolute;
  top: 21%;
  left: 45%;
  width: 10%;
}
.fanSpeed {
  position: absolute;
  top: 56vw;
  left: 35vw;
  width: 30vw;
  height: 10vw;
}
.fanIcon {
  position: absolute;
  width: 14%;
  left: 43%;
}
.fanRpm {
  font-weight: bold;
  font-size: 5vw;
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
}
.svgBg {
  position: absolute;
  top: 8.5%;
  left: 7%;
  width: 86%;

}
#tempCanvas {
  width:100%;
  height:100%;
}
.tempBox {
  position: absolute;
  width:40vw;
  left: 30vw;
  padding-top:27vw;
  text-align: center
}
.tempBox hr {
  border-color: #666;
  margin-top: -0.2em;
}
.cpuTemp {
  font-weight: bold;
  font-size: 10vw;
  font-family: 'DIN Condensed', sans-serif;
  line-height: 0.9em;
  padding-top: 0.15em;
}
.gpuTemp {
  font-weight: bold;
  font-size: 10vw;
  font-family: 'DIN Condensed', sans-serif;
  line-height: 0.9em;
  padding-top: 0.2em;
}

section {
  border: 1px solid transparent;
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100vw - 2px);
  height: calc(68vw - 2px);
}
</style>
