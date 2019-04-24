<template>
  <q-page class="q-pa-md">
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
      <div class="q-pa-md">
        <q-btn-dropdown color="primary" :label="type ? datasets[0].label : 'Operações'">
          <q-list>
            <q-item clickable v-close-popup>
              <q-item-section @click.prevent="viewOperation('I')">
                <q-item-label>Depósitos</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup>
              <q-item-section @click.prevent="viewOperation('O')">
                <q-item-label>Saques</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup>
              <q-item-section @click.prevent="viewOperation('TI')">
                <q-item-label>Transferências recebidas</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup>
              <q-item-section @click.prevent="viewOperation('TO')">
                <q-item-label>Transferências enviadas</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <q-btn-dropdown color="primary" :label="year ? year : 'Todos os anos'">
          <q-list>
            <q-item clickable v-close-popup>
              <q-item-section @click.prevent="viewYear('2015')">
                <q-item-label>2015</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup>
              <q-item-section @click.prevent="viewYear('2016')">
                <q-item-label>2016</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup>
              <q-item-section @click.prevent="viewYear('2017')">
                <q-item-label>2017</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup>
              <q-item-section @click.prevent="viewYear('2018')">
                <q-item-label>2018</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup>
              <q-item-section @click.prevent="viewYear('')">
                <q-item-label>Todos os anos</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>

    <line-chart :labels="labels" :datasets="datasets"></line-chart>
  </q-page>
</template>

<script>
import LineChart from '../../components/charts/LineCharts.js'
import { mapActions } from 'vuex'
// import BarChart from '../../components/charts/BarCharts.js'
export default {
  created () {
    this.reportHistoric()
  },

  data () {
    return {
      type: 'O',
      year: '',
      labels: [],
      datasets: [{
        label: 'Saques',
        backgroundColor: 'transparent',
        borderColor: 'red',
        data: []
      }]
    }
  },

  computed: {
    params () {
      return {
        type: this.type,
        year: this.year
      }
    }
  },

  methods: {
    ...mapActions('historics', ['reports']),
    reportHistoric () {
      this.reports({ ...this.params }).then((res) => {
        this.labels = res.labels
        this.datasets[0].data = res.datasets
      })
    },

    viewOperation (type) {
      this.type = type
      this.datasets[0].label = this.verifyType(this.type)
      this.reportHistoric()
    },

    viewYear (year) {
      this.year = year
      this.reportHistoric()
    },

    verifyType (type) {
      let label = ''
      switch (this.type) {
        case 'O':
          this.datasets[0].borderColor = 'red'
          label = this.datasets[0].label = 'Saques'
          break
        case 'I':
          this.datasets[0].borderColor = 'green'
          label = this.datasets.label = 'Depósitos'
          break
        case 'TI':
          this.datasets[0].borderColor = 'MediumSeaGreen'
          label = this.datasets.label = 'Transferências recebidas'
          break
        case 'TO':
          this.datasets[0].borderColor = 'OrangeRed'
          label = this.datasets.label = 'Transferècias enviadas'
          break
      }
      return label
    }
  },

  components: {
    LineChart
  }
}
</script>

<style scoped>

</style>
