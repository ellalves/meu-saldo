<template>
  <q-page class="q-pa-md">
    <q-card flat class="col-md-6 col-xs-12">
      <q-card-section>
        <div class="text-h6">Usuários Cadastrados</div>
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
              <q-td key="name" :props="props">
                {{ props.row.name }}
                <q-btn dense round flat :icon="props.expand ? 'arrow_drop_up' : 'arrow_drop_down'" @click="props.expand = !props.expand" />
              </q-td>
              <!-- <q-td key="type" :props="props">{{ props.row.type }}</q-td>
              <q-td key="document" :props="props">{{ props.row.document }}</q-td> -->
              <q-td key="created_at" :props="props">{{ props.row.created_at }}</q-td>
              <q-td key="condition" :props="props" v-html="status(props.row.condition, true)"></q-td>
              <q-td auto-width>
                <q-btn flat round dense icon="more_vert">
                  <q-menu fit>
                    <q-list style="min-width: 100px">
                      <q-item clickable v-if="can('edit_user')">
                        <q-item-section avatar>
                          <q-avatar icon="edit" color="primary" text-color="white" />
                        </q-item-section>
                        <q-item-section>Editar</q-item-section>
                      </q-item>

                      <q-item clickable v-if="can('delete_user')">
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
                  <strong>{{props.row.type}}:</strong> {{ props.row.document }} <br />
                  <strong>E-mail:</strong> {{ props.row.email }} <br />
                  <strong>Sexo:</strong> {{ formatSex(props.row.sex) }} <br />
                  <strong>Telefone:</strong> {{ props.row.phone }} {{ props.row.celular ? '/ ' + props.row.celular : '' }} <br />
                </div>
              </q-td>
            </q-tr>
          </template>

          <!-- <template v-slot:bottom="props">
            <div  class="float-right">
              Mostrando de {{ props.pagination.page }}
              até {{ props.pagination.page + props.pagination.rowsPerPage }}
              de {{ props.pagination.rowsNumber }}
              {{props.rows-per-page-label}}
              <q-btn @click.native="() => props.prevPage()" label="<< Anterior" v-if="!props.isFirstPage"></q-btn>
              <q-btn @click.native="() => props.nextPage()" label="Proximo >>" v-if="!props.isLastPage"></q-btn>
            </div>
          </template> -->
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mixin } from '../../components/mixins/mixin.js'
export default {
  name: 'Users',

  data () {
    return {
      filter: '',
      loading: false,
      selected: [],
      pagination: {
        sortBy: 'id',
        descending: true,
        page: 1,
        rowsPerPage: 20,
        rowsNumber: 10
      },
      columns: [
        { name: 'id', align: 'center', label: '#', field: 'id', sortable: true },
        { name: 'name', align: 'left', label: 'Nome', field: 'name', sortable: true },
        // { name: 'type', label: 'Tipo', field: 'type', sortable: true },
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
    ...mapState('users', ['users']),
    params () {
      return {
        page: this.users.current_page, // Pega a pagina atual
        per_page: this.pagination.rowsPerPage, // Pega a quantidade de pagina
        filter: this.filter, // Pega o termo pesquisado
        column: this.pagination.sortBy,
        order: 'asc'
      }
    }
  },

  methods: {
    ...mapActions('users', ['loadUsers']),

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

      this.loadUsers({ ...this.params, page })
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

  mixins: [mixin]
}
</script>

<style>
</style>
