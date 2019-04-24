<template>
  <q-page class="row">
    <q-card class="col-12">
      <q-card-section>
        <div class="text-h6">Funções Cadastradas</div>
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

          <template v-slot:top>
            <q-btn icon="supervised_user_circle" color="primary" :disable="loading" label="Adicionar função" @click="mRoles = true" />

            <q-space />

            <q-input dense debounce="300" v-model="filter" placeholder="Procurar">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="id" :props="props">{{ props.row.id }}</q-td>
              <q-td key="label" :props="props">
                {{props.row.label }}
                <q-popup-edit v-model="props.row.label"
                  buttons
                  label-set="Salvar"
                  label-cancel="Fechar"
                  @save="saveRole(props.row)"
                  v-if="can('edit_role')"
                >
                  <q-input v-model="props.row.label"
                    hint="Campo obrigatório!"
                    :error="errorRole"
                    :error-message="errorMessageRole"
                    dense
                    autofocus
                  />
                </q-popup-edit>
                <q-tooltip anchor="center left" self="center left"> Clique para editar</q-tooltip>
              </q-td>

              <q-td key="actions" auto-width>
                <q-btn flat round dense icon="more_vert">
                  <q-menu fit>
                    <q-list>
                      <q-item clickable v-close-popup v-if="can('associate_permissions')" @click.native="getPermissions(props.row)">
                        <q-item-section avatar>
                          <q-avatar icon="lock" color="primary" text-color="white" />
                        </q-item-section>
                        <q-item-section>Permissões</q-item-section>
                      </q-item>

                      <q-item clickable v-close-popup v-if="can('view_role')">
                        <q-item-section avatar>
                          <q-avatar :icon="props.expand ? 'visibility' : 'visibility_off'" color="secondary" text-color="white" />
                        </q-item-section>
                        <q-item-section @click="props.expand = !props.expand">
                          Detalhes
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                  </q-btn>
              </q-td>
            </q-tr>

            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%">
                <div class="text-left">
                  <strong>Nome:</strong> {{ props.row.name }} <br />
                  <strong>Criado em:</strong> {{ formatDateTime(props.row.created_at) }} <br />
                  <span v-if="props.row.updated_at">
                    <strong>Atualizado em:</strong> {{ formatDateTime(props.row.updated_at) }} <br />
                  </span>
                </div>
              </q-td>
            </q-tr>
          </template>

        </q-table>
      </q-card-section>
    </q-card>

    <!--// Permissões associadas //-->
    <q-dialog
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
      v-model="mPermissions"
      v-if="can('associate_permissions')"
    >
      <q-card>
        <q-bar>
          <div class="text-h6">Função: {{ getRole.label }}</div>
          <q-space />

          <q-btn dense flat icon="minimize" @click="maximizedToggle = false" :disable="!maximizedToggle">
            <q-tooltip v-if="maximizedToggle" content-class="bg-white text-primary">Minimizar</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="crop_square" @click="maximizedToggle = true" :disable="maximizedToggle">
            <q-tooltip v-if="!maximizedToggle" content-class="bg-white text-primary">Maximizar</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Fechar</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section class="q-pa-md">
          <div class="q-gutter-sm">
            <q-option-group
              :options="optPermissions"
              checked-icon="check"
              type="toggle"
              v-model="optPermSel"
              inline
            />
          </div>

          <q-separator />

          <q-card-actions class="float-right">
            <q-btn icon="save" color="positive" label="Salvar" @click.native="savePermissions(getRole)" />
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!--// Funções //-->
    <q-dialog
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
      v-model="mRoles"
      v-if="can('add_role')"
    >
      <q-card>
        <q-bar>
          <div class="text-h6">Adicionar Função</div>
          <q-space />

          <q-btn dense flat icon="minimize" @click="maximizedToggle = false" :disable="!maximizedToggle">
            <q-tooltip v-if="maximizedToggle" content-class="bg-white text-primary">Minimizar</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="crop_square" @click="maximizedToggle = true" :disable="maximizedToggle">
            <q-tooltip v-if="!maximizedToggle" content-class="bg-white text-primary">Maximizar</q-tooltip>
          </q-btn>
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Fechar</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section class="q-pa-md">
          <q-input v-model="role.name" label="Nome" />
          <q-input v-model="role.label" label="Etiqueta" />

          <q-separator />

          <q-card-actions class="float-right">
            <q-btn icon="save" color="positive" label="Salvar" @click.native="addFunction" v-close-popup />
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mixin } from '../../components/mixins/mixin.js'
import { dateTime } from '../../components/mixins/dateTime'
export default {
  name: 'Roles',

  data () {
    return {
      role: {},
      errorRole: false,
      errorMessageRole: '',
      getRole: ['aguarde ...'],
      maximizedToggle: true,
      optPermSel: [],
      optPermissions: [],
      mPermissions: false,
      mRoles: false,
      filter: '',
      loading: false,
      pagination: {
        sortBy: 'id',
        descending: true,
        page: 1,
        rowsPerPage: 20,
        rowsNumber: 10
      },
      columns: [
        { name: 'id', align: 'left', label: '#', field: 'id', sortable: true },
        { name: 'label', align: 'left', label: 'Etiqueta', field: 'label', sortable: true },
        { name: 'actions', label: 'Ações', align: 'center', field: '', sortable: false }
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
    params () {
      return {
        page: this.original.current_page, // Pega a pagina atual
        per_page: this.pagination.rowsPerPage, // Pega a quantidade de pagina
        filter: this.filter, // Pega o termo pesquisado
        column: this.pagination.sortBy,
        order: 'asc'
      }
    }
  },

  methods: {
    ...mapActions('roles', ['addRole']),
    addFunction () {
      this.addRole(this.role)
        .then((res) => {
          this.$q.notify({
            message: res.message,
            color: 'green-10',
            position: 'center',
            icon: 'done_outline'
          })
          this.onRequest({
            pagination: this.pagination,
            filter: undefined
          })
        })
        .catch(() => {
          this.$q.notify({
            message: 'Oooops! Ocorreu um erro inesperado.',
            color: 'red-10',
            position: 'center',
            icon: 'error_outline',
            timeout: Math.random() * 5000 + 3000
          })
        })
    },
    ...mapActions('roles', ['updateRole']),
    saveRole (props) {
      if (props) {
        this.updateRole(props).then((res) => {
          this.$q.notify({
            message: res.message,
            color: 'green-10',
            position: 'center',
            icon: 'done_outline'
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
    validateRole (val) {
      if (val !== '' || val !== undefined) {
        this.errorRole = true
        this.errorMessageRole = 'Deu erro!'
        return false
      }
      this.errorRole = false
      this.errorMessageRole = ''
      return true
    },
    ...mapActions('roles', ['rolePermissions']),
    getPermissions (role) {
      this.checkOptions(null)
      this.mPermissions = true
      this.rolePermissions({ 'id': role.id })
        .then((res) => {
          this.getRole = role
          this.optPermSel = res.map((q) => q.id)
        })
        .catch((err) => err)
    },
    ...mapActions('permissions', ['optionsPermissions']),
    checkOptions (q) {
      this.optionsPermissions({ 'q': q })
        .then((res) => {
          this.optPermissions = res.map((q) => {
            return { 'label': q.label, 'value': q.id }
          })
        })
    },
    ...mapActions('permissions', ['saveRolePermissions']),
    savePermissions (role) {
      this.saveRolePermissions({ 'role': role.id, 'permissions': this.optPermSel })
        .then((res) => {
          this.$q.notify({
            message: res.message,
            color: 'green-10',
            position: 'center',
            icon: 'done_outline'
          })
        })
        .catch(() => {
          this.$q.notify({
            message: 'Oooops! Ocorreu um erro inesperado.',
            color: 'red-10',
            position: 'center',
            icon: 'error_outline',
            timeout: Math.random() * 5000 + 3000
          })
        })
    },
    ...mapActions('roles', ['loadRoles']),
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

      this.loadRoles({ ...this.params, page })
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
