<template>
  <section>
    <div class="speedometer cpu">
      <canvas id="cpuSpeedometer" ref="cpuSpeedometer"></canvas>
      <h2>CPU</h2>
      <div class="speedMhz">{{ animatedCpuSpeed.toLocaleString("en", { minimumFractionDigits: 0, maximumFractionDigits: 0}) }}</div>
      <h3>MHz</h3>
    </div>
    <div class="speedometer gpu">
      <canvas id="gpuSpeedometer" ref="gpuSpeedometer"></canvas>
      <h2>GPU</h2>
      <div class="speedMhz">{{ animatedGpuSpeed.toLocaleString("en", { minimumFractionDigits: 0, maximumFractionDigits: 0}) }}</div>
      <h3>MHz</h3>
    </div>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import {Circ, TweenLite} from "gsap";

export default {
  name: 'Speedometer',
  props: {
    msg: String
  },
  data() {
    return {
      ctxCpu: null,
      ctxGpu: null,
      animatedCpuSpeed: 0,
      animatedGpuSpeed: 0,
    }
  },
  computed: {
    ...mapState(['monitor']),
    ...mapGetters({
      cpuSpeed: 'cpuSpeed',
      gpuSpeed: 'gpuSpeed',
    }),
  },
  watch: {
    monitor: function() {
      this.updateCanvas();
      this.animateSpeedValues();
    }
  },
  methods: {
    animateSpeedValues() {
      TweenLite.to(this, 1.5, {
        animatedCpuSpeed: this.cpuSpeed,
        roundProps: 'animatedCpuSpeed',
        ease: Circ.easeInOut,
      });

      TweenLite.to(this, 1.5, {
        animatedGpuSpeed: this.gpuSpeed,
        roundProps: 'animatedGpuSpeed',
        ease: Circ.easeInOut,
      });
    },
    drawGauge(w,h,ctx,percentage) {
      ctx.beginPath();
      ctx.lineWidth = w / 88;
      ctx.strokeStyle = '#858A94';
      ctx.arc(w/2, h/2, w/2 - ctx.lineWidth, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = w / 18;
      ctx.strokeStyle = '#39708d';
      ctx.arc(w/2, h/2, w/2 - ctx.lineWidth - (w*.015), 0, 2 * Math.PI);
      ctx.stroke();


      let startAngle = -0.5 * Math.PI;
      let endAngle = 1.5 * Math.PI;
      let range = endAngle - startAngle;
      let currAngle = startAngle + (range * percentage);
      ctx.beginPath();
      ctx.lineWidth = w / 12;
      ctx.strokeStyle = '#ffffff';
      ctx.arc(w/2, h/2, w/2 - ctx.lineWidth, startAngle, currAngle);
      ctx.stroke();

    },
    updateCanvas: function() {
      if( !this.ctxCpu ) return;
      if( !this.ctxGpu ) return;

      let wc = this.ctxCpu.canvas.width;
      let hc = this.ctxCpu.canvas.height;
      this.ctxCpu.clearRect(0, 0, wc, hc);
      this.drawGauge(wc,hc,this.ctxCpu, this.cpuSpeed/5200);

      // clear everything
      let wg = this.ctxGpu.canvas.width;
      let hg = this.ctxGpu.canvas.height;
      this.ctxGpu.clearRect(0, 0, wg, hg);
      this.drawGauge(wc,hc,this.ctxGpu, this.gpuSpeed/2000);

    }
  },
  mounted() {
    if (this.$refs.cpuSpeedometer && this.$refs.gpuSpeedometer) {
      this.ctxCpu = this.$refs.cpuSpeedometer.getContext('2d');
      this.ctxCpu.canvas.height = this.$refs.cpuSpeedometer.clientHeight;
      this.ctxCpu.canvas.width = this.$refs.cpuSpeedometer.clientWidth;

      this.ctxGpu = this.$refs.gpuSpeedometer.getContext('2d');
      this.ctxGpu.canvas.height = this.$refs.gpuSpeedometer.clientHeight;
      this.ctxGpu.canvas.width = this.$refs.gpuSpeedometer.clientWidth;

      this.updateCanvas();
      this.animateSpeedValues();
    }
  }
}
</script>

<style scoped>
h2 {
  margin: 5.1vw 0 0 0;
  font-size: 3vw;
  text-align: center;
  padding: 0;
  font-family: 'DIN Condensed', sans-serif;
  color: #aaaaaa;
}
h3 {
  font-size: 3vw;
  text-align: center;
  margin: 0;
  padding: 0;
  font-family: 'DIN Condensed', sans-serif;
  color: #aaaaaa;
}
.speedMhz {
  text-align: center;
  font-size: 5.6vw;
  font-family: 'DIN Condensed', sans-serif;

}
#cpuSpeedometer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
#gpuSpeedometer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.speedometer {
  position: absolute;
  width: 23vw;
  height: 23vw;
  bottom: 3.5vw;
}
.speedometer.cpu {
  left: 0;
}
.speedometer.gpu {
  right: 2vw;
}
section {
  position: absolute;
  width: 49vw;
  height: 30vw;
  left: 51vw;
  top: 70vw;

  font-size: 5vw;
}
</style>
