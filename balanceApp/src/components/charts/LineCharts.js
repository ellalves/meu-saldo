import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  props: {
    labels: {
      required: false,
      type: Array
    },
    datasets: {
      required: false,
      type: Array
    }
  },

  mounted () {
    this.charts()
  },

  methods: {
    charts () {
      this.renderChart({
        labels: this.labels,
        datasets: this.datasets
      }, { responsive: true, maintainAspectRatio: false })
    }
  },

  watch: {
    labels () {
      this.charts()
    }
  }
}
