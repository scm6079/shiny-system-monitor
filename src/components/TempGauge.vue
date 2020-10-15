<template>
  <section>

    <div id="tempGauge">
      <canvas id="tempCanvas" ref="canvas"></canvas>
      <img src="@/assets/temp-gauge.svg" class="svgBg">
      <img src="@/assets/exclamation-triangle.svg" class="alert" v-if="isAlert">
    </div>
    <div class="tempBox">
      <div class="cpuTemp" :style="cpuStyle">CPU {{ cpuDisplayTemp }}&deg; c</div>
      <hr>
      <div class="gpuTemp" :style="gpuStyle">GPU {{ gpuDisplayTemp }}&deg; c</div>
    </div>
    <div class="fanSpeed">
      <img src="@/assets/fan-icon.svg" class="fanIcon" v-if="fanSpeed">
      <div class="fanRpm">
        {{ animatedFanSpeed.toLocaleString() }} RPM
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { TweenLite, Circ } from 'gsap';

const MAX_CPU_TEMP = 95;
const MAX_GPU_TEMP = 95;
const MAX_FAN_RPM = 2000;

export default {
  name: 'TempGauge',
  props: {
    msg: String
  },
  data() {
    return {
      context: null,
      animatedCpuTemp: 0,
      animatedGpuTemp: 0,
      animatedFanSpeed: 0,
    }
  },
  computed: {
    ...mapState(['monitor']),
    ...mapGetters({
      cpuTemp: 'cpuTemp',
      gpuTemp: 'gpuTemp',
      fanSpeed: 'fanSpeed',
    }),
    cpuStyle: function() {
      if( this.cpuTemp >= 90 ) return 'color: #f83434';
      if( this.cpuTemp >= 80 ) return 'color: #d46e1d';
      else if( this.cpuTemp > 70 ) return 'color: #258752';
      else return 'color: #008185';
    },
    gpuStyle: function() {
      if( this.gpuTemp >= 90 ) return 'color: #f83434';
      if( this.gpuTemp >= 80 ) return 'color: #d46e1d';
      else if( this.gpuTemp > 70 ) return 'color: #258752';
      else return 'color: #008185';
    },
    isAlert: function() {
      return ( this.cpuTemp > 85 || this.gpuTemp > 85 );
    },
    cpuDisplayTemp() {
      return this.animatedCpuTemp;
    },
    gpuDisplayTemp() {
      return this.animatedGpuTemp;
    }
  },
  watch: {
    monitor: function() {
      this.updateCanvas();
      this.animateTemperatureValues();
    }
  },
  methods: {
    animateTemperatureValues() {
      TweenLite.to(this, 1.5, {
        animatedCpuTemp: this.cpuTemp,
        roundProps: 'animatedCpuTemp',
        ease: Circ.easeInOut,
      });

      TweenLite.to(this, 1.5, {
        animatedGpuTemp: this.gpuTemp,
        roundProps: 'animatedGpuTemp',
        ease: Circ.easeInOut,
      });

      TweenLite.to(this, 1.5, {
        animatedFanSpeed: this.fanSpeed,
        roundProps: 'animatedFanSpeed',
        ease: Circ.easeInOut,
      });
    },
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
    // We sweep from the bottom clockwise instead of the right, to make our math a little easier, so correct for it here
    arcFromBottom(x, y, w, h, r, start, end, stroke, dash, style) {
      this.context.beginPath();
      this.context.arc(x, y, r, start+0.5*Math.PI, end+0.5*Math.PI, false);
      this.context.lineWidth = stroke;
      this.context.strokeStyle = style;
      this.context.setLineDash(dash);
      this.context.stroke();

    },
    drawCpuGauge(w,h,stroke) {
      let dash = [stroke*1.8, stroke/0.64];
      let radius = (w/2) - (w/45.5833333333);
      let startAngle = 0.286 * Math.PI;
      let endAngle = 1.716 * Math.PI;
      let range = endAngle - startAngle;
      let percent = Math.min(this.cpuTemp, MAX_CPU_TEMP) / MAX_CPU_TEMP;
      let position = Math.pow(percent, 2.4 );
      let currAngle = startAngle + (range * position);
      let temperatureGradient = this.context.createLinearGradient( (w/2) - radius, 0, (w/2) + radius, 0);
      temperatureGradient.addColorStop("0", '#05114c');
      temperatureGradient.addColorStop("0.5" , '#258752');
      temperatureGradient.addColorStop("1.0", '#f83434');

      // draw CPU ring BG
      this.arcFromBottom( w/2, h/1.64, w, h, radius, startAngle, endAngle, stroke, dash, '#ffffff1a');

      // draw CPU ring FG
      this.arcFromBottom( w/2, h/1.64, w, h, radius, startAngle, currAngle, stroke, dash, temperatureGradient);
    },
    drawGpuGauge(w,h,stroke) {
      let dash = [stroke*3.8, stroke/0.6];
      let radius = (w/2) - (w/8.0441176471);
      let startAngle = 0.33 * Math.PI;
      let endAngle = 1.67 * Math.PI;
      let range = endAngle - startAngle;
      let percent = Math.min(this.gpuTemp, MAX_GPU_TEMP) / MAX_GPU_TEMP;
      let position = Math.pow(percent, 2.4 );
      let currAngle = startAngle + (range * position);
      let temperatureGradient = this.context.createLinearGradient( (w/2) - radius, 0, (w/2) + radius, 0);
      temperatureGradient.addColorStop("0", '#05114c');
      temperatureGradient.addColorStop("0.5" , '#258752');
      temperatureGradient.addColorStop("1.0", '#f83434');

      // draw GPU ring BG
      this.arcFromBottom( w/2, h/1.64, w, h, radius, startAngle, endAngle, stroke, dash, '#ffffff1a');

      // draw GPU ring FG
      this.arcFromBottom( w/2, h/1.64, w, h, radius, startAngle, currAngle, stroke, dash, temperatureGradient);
    },
    drawFanGauge(w,h) {
      let stroke = w / 38;
      let dash = [0, stroke*1.8];
      let radius = w/2 - (w/10.1296296296);
      let startAngle = 0.738 * Math.PI;
      let endAngle = 1.3 * Math.PI;

      let range = endAngle - startAngle;
      let percent = Math.min(this.fanSpeed, MAX_FAN_RPM) / MAX_FAN_RPM;
      let currAngle = startAngle + (range * percent);

      this.arcFromBottom( w/2, h/0.775, w, h, radius, startAngle, endAngle, stroke, dash, '#ffffff1a');
      if( this.fanSpeed ) {
        this.arcFromBottom( w/2, h/0.775, w, h, radius, startAngle, currAngle, stroke, dash, '#9ddbf1');
      }
    },
    updateCanvas: function() {
      if( !this.context ) return;

      let w = this.context.canvas.width;
      let h = this.context.canvas.height;
      let stroke = w / 22.7916666667;

      // clear everything
      this.context.clearRect(0, 0, w, h);
      this.context.lineCap = 'round';

      this.drawCpuGauge(w,h,stroke);
      this.drawGpuGauge(w,h,stroke);
      this.drawFanGauge(w,h);

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
      this.animateTemperatureValues();
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
  color: #ccc;
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
  margin-top: -0.3vw;
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
