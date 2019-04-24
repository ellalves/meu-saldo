
import {Line} from 'vue-chartjs'

export default {
  extends: Line,
  props: {
    labels: [],
    datasets: {}
  },

  mounted () {
    this.renderChart({
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: this.datasets
    }, {responsive: true, maintainAspectRatio: false})

  }
}