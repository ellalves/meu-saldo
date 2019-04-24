<template>
  <q-page class="q-pa-md">
    <q-card flat class="col-md-6 col-xs-12">
      <q-card-section>
        <div class="text-h6">Boletos Cadastrados</div>
        <div class="text-subtitle2"></div>
      </q-card-section>

      <q-card-section>
        <q-table
          :data="data"
          row-key="id"
          :columns="columns"
          :pagination.sync="pagination"
          :loading="loading"
          :filter="filter"
          @request="onRequest"
          binary-state-sort
          :rows-per-page-options="[5, 10, 20, 50, 100, 0]"
          :rows-per-page-label="'Registros por página:'"
        >

          <template v-slot:top-right>
            <q-input dense debounce="300" v-model="filter" placeholder="Procurar">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="id" :props="props">{{ props.row.id }}</q-td>
              <q-td key="document_number" :props="props">
                {{ props.row.document_number }}
                <q-btn dense round flat :icon="props.expand ? 'arrow_drop_up' : 'arrow_drop_down'" @click="props.expand = !props.expand" />
                </q-td>
              <q-td key="due_date" :props="props">{{ formatDate(props.row.due_date) }}</q-td>
              <!-- <q-td key="type" :props="props">{{ props.row.type }}</q-td>
              <q-td key="document" :props="props">{{ props.row.document }}</q-td> -->
              <q-td key="created_at" :props="props">{{ formatDateTime(props.row.created_at) }}</q-td>
              <q-td key="condition" :props="props" v-html="status(props.row.condition, true)"></q-td>
              <q-td auto-width>
                <q-btn flat round dense icon="more_vert">
                  <q-menu fit>
                    <q-list style="min-width: 100px">
                      <q-item clickable v-close-popup v-if="can('pay_billet') && props.row.condition !== 'actived'" @click.native="onConfirmPay(props.row)">
                        <q-item-section avatar>
                          <q-avatar icon="local_atm" color="primary" text-color="white" />
                        </q-item-section>
                        <q-item-section>Validar pagamento</q-item-section>
                      </q-item>

                      <q-item clickable v-close-popup v-if="can('view_billet')" tag="a" target="_blank" :href="`https://saldo.ellalves.net.br/boleto/${props.row.id}`">
                        <q-item-section avatar>
                          <q-avatar icon="pageview" color="info" text-color="white" />
                        </q-item-section>
                        <q-item-section>
                            Visualizar
                        </q-item-section>
                      </q-item>

                      <q-item clickable v-close-popup v-if="can('delete_user') && props.row.condition != 'actived'" @click.native="onConfirmDelete(props.row)">
                        <q-item-section avatar>
                          <q-avatar icon="delete_outline" color="negative" text-color="white" />
                        </q-item-section>
                        <q-item-section>Apagar</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                  </q-btn>
              </q-td>
            </q-tr>

            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%">
                <div class="text-left">
                  <strong>Valor:</strong> {{ formatPrice(props.row.price) }} <br />
                  <strong>Usuário:</strong> {{ props.row.user.name }} <br />
                  <strong>Telefone:</strong> {{ props.row.phone }} {{ props.row.celular ? '/ ' + props.row.celular : '' }} <br />
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="confirmPay" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="block" color="negative" text-color="white" />
          <span class="q-ml-sm">Tem certeza que quer validar esse pagamento?  </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="warning" v-close-popup />
          <q-btn flat label="Confirmar" color="positive" v-close-popup @click.native="onPay" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="deleteTicket" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="block" color="negative" text-color="white" />
          <span class="q-ml-sm">Tem certeza que quer deletar esse boleto?  </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="warning" v-close-popup />
          <q-btn flat label="Confirmar" color="positive" v-close-popup @click.native="onDelete" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mixin } from '../../components/mixins/mixin.js'
import { dateTime } from '../../components/mixins/dateTime'
export default {
  name: 'Tickets',

  data () {
    return {
      propsTicket: {},
      confirmPay: false,
      deleteTicket: false,
      filter: '',
      loading: false,
      selected: [],
      pagination: {
        sortBy: 'condition',
        descending: true,
        page: 1,
        rowsPerPage: 20,
        rowsNumber: 10
      },
      columns: [
        { name: 'id', align: 'center', label: '#', field: 'id', sortable: true },
        { name: 'document_number', align: 'left', label: 'Número', field: 'document_number', sortable: true },
        { name: 'due_date', label: 'Validade', field: 'due_date', sortable: true },
        // { name: 'document', label: 'Documento', field: 'document', sortable: true },
        { name: 'created_at', label: 'Criado em', field: 'created_at', sortable: true },
        { name: 'condition', label: 'Condição', field: 'condition', sortable: true },
        { label: 'Ações', field: 'condition' }
      ],
      data: [],
      original: []
    }
  },

  mounted () {
    this.onRequest({
      pagination: this.pagination,
      filter: undefined
    })
  },

  computed: {
    ...mapState('auth', ['me']),
    ...mapState('tickets', ['tickets']),
    params () {
      return {
        page: this.tickets.current_page, // Pega a pagina atual
        per_page: this.pagination.rowsPerPage, // Pega a quantidade de pagina
        filter: this.filter, // Pega o termo pesquisado
        column: this.pagination.sortBy,
        order: 'desc'
      }
    }
  },

  methods: {
    onConfirmPay (props) {
      this.confirmPay = true
      this.propsTicket = props
    },

    onConfirmDelete (props) {
      this.deleteTicket = true
      this.propsTicket = props
    },

    ...mapActions('tickets', ['payTicket']),
    onPay () {
      if (this.confirmPay) {
        this.payTicket({ 'id': this.propsTicket.id, 'payer': this.propsTicket.payer }).then((res) => {
          this.onRequest({
            pagination: this.pagination,
            filter: undefined
          })
          this.$q.notify({
            message: 'Pagamento confirmado!',
            color: 'green-10',
            position: 'center',
            icon: 'done_outline',
            timeout: Math.random() * 5000 + 3000
          })
        }).catch(() => {
          this.$q.notify({
            message: 'Oooops! Ocorreu um erro inesperado.',
            color: 'red-10',
            position: 'center',
            icon: 'error_outline',
            timeout: Math.random() * 5000 + 3000
          })
        })
      }
    },

    ...mapActions('tickets', ['destroyTicket']),
    onDelete (props) {
      this.destroyTicket({ 'id': this.propsTicket.id }).then((res) => {
        this.onRequest({
          pagination: this.pagination,
          filter: undefined
        })
        this.$q.notify({
          message: 'Boleto deletado!',
          color: 'green-10',
          position: 'center',
          icon: 'done_outline',
          timeout: Math.random() * 5000 + 3000
        })
      }).catch(() => {
        this.$q.notify({
          message: 'Oooops! Ocorreu um erro inesperado.',
          color: 'red-10',
          position: 'center',
          icon: 'error_outline',
          timeout: Math.random() * 5000 + 3000
        })
      })
    },
    ...mapActions('tickets', ['loadTickets']),
    onRequest (props) {
      let { page, rowsPerPage, rowsNumber, sortBy, descending } = props.pagination
      let filter = props.filter
      this.loading = true
      // atualiza rowsCount com o valor apropriado
      this.pagination.rowsPerPage = rowsPerPage === 0 ? rowsNumber : rowsPerPage
      // obter todas as linhas se 'All' (0) estiver selecionado
      let fetchCount = this.pagination.rowsPerPage

      // calcular a linha inicial de dados
      let startRow = (page - 1) * rowsPerPage
      // não se esqueça de atualizar o objeto de paginação local
      this.pagination.page = page
      this.pagination.sortBy = sortBy
      this.pagination.descending = descending

      this.loadTickets({ ...this.params, page })
        .then((res) => {
          this.original = res.data
          this.pagination.rowsNumber = this.getRowsNumberCount(filter, res.total)
          // Organiza dados do 'servidor'
          let returnedData = this.fetchFromServer(startRow, fetchCount, filter, sortBy, descending)

          // limpar os dados existentes e adicionar novos
          this.data.splice(0, this.data.length, ...returnedData)
        }).finally(() => { this.loading = false })
    },

    // buscar dados do 'servidor'
    fetchFromServer (startRow, count, filter, sortBy, descending) {
      let data = []

      if (!filter) {
        data = this.original
      } else {
        let found = 0
        for (let index = startRow, items = 0; index < this.original.length && items < count; ++index) {
          let row = this.original[index]
          // filtro de correspondência?
          if (!row['name'].includes(filter)) {
            // obter uma linha diferente, até que uma seja encontrada
            continue
          }
          ++found
          if (found > startRow) {
            data.push(row)
            ++items
          }
        }
      }

      // lidar com o sortBy
      if (sortBy) {
        data.sort((a, b) => {
          let x = descending ? b : a
          let y = descending ? a : b
          if (sortBy === 'name') {
            // tipo string'
            return x[sortBy] > y[sortBy] ? 1 : x[sortBy] < y[sortBy] ? -1 : 0
          } else {
            // classificação numérica
            return parseFloat(x[sortBy]) - parseFloat(y[sortBy])
          }
        })
      }
      return data
    },

    // contar número de linhas
    getRowsNumberCount (filter, count = 0) {
      if (!filter) {
        return count
      }
      // let count = 0
      this.original.forEach((treat) => {
        if (treat['name'].includes(filter)) {
          ++count
        }
      })
      return count
    }
  },

  mixins: [mixin, dateTime]
}
</script>

<style>
</style>
