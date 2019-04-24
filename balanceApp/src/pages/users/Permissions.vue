<template>
  <q-page class="row">
    <q-card class="col-12">
      <q-card-section>
        <div class="text-h6">Permissões Cadastradas</div>
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
            <q-btn icon="lock" color="primary" :disable="loading" label="Adicionar permissão" @click="mPermissions = true" />

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
                {{ props.row.label }}
                <q-popup-edit v-model="props.row.label"
                  buttons
                  label-set="Salvar"
                  label-cancel="Fechar"
                  @save="savePermission(props.row)"
                  persistent
                  v-if="can('edit_role')"
                >
                  <q-input v-model="props.row.label"
                    hint="Campo obrigatório!"
                    :error="errorPermission"
                    :error-message="errorMessagePermission"
                    dense
                    autofocus
                  />
                </q-popup-edit>
              </q-td>

              <q-td key="actions" auto-width>
                <q-btn flat round dense icon="more_vert">
                  <q-menu fit>
                    <q-list>
                      <q-item clickable v-close-popup v-if="can('associate_roles')" @click.native="getPermissions(props.row)">
                        <q-item-section avatar>
                          <q-avatar icon="supervised_user_circle" color="primary" text-color="white" />
                        </q-item-section>
                        <q-item-section>Funções</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup v-if="can('view_permission')">
                        <q-item-section avatar>
                          <q-avatar :icon="props.expand ? 'visibility' : 'visibility_off'" color="primary" text-color="white" />
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

    <!--// Funções associadas //-->
    <q-dialog
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
      v-model="mRoles"
      v-if="can('associate_roles')"
    >
      <q-card>
        <q-bar>
          <div class="text-h6">Função: {{ getPermission.label }}</div>
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
              :options="optRoles"
              checked-icon="check"
              type="toggle"
              v-model="optRoleSel"
              inline
            />
          </div>

          <q-separator />

          <q-card-actions class="float-right">
            <q-btn icon="save" color="positive" label="Salvar" @click.native="savePermissions(getPermission)" />
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!--// Permissões //-->
    <q-dialog
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
      v-model="mPermissions"
      v-if="can('add_permission')"
    >
      <q-card>
        <q-bar>
          <div class="text-h6">Adicionar Permissão</div>
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
  name: 'Permissions',

  data () {
    return {
      role: {},
      errorPermission: false,
      errorMessagePermission: '',
      getPermission: ['aguarde ...'],
      maximizedToggle: true,
      optRoleSel: [],
      optRoles: [],
      mRoles: false,
      mPermissions: false,
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
    ...mapActions('permissions', ['addPermission']),
    addFunction () {
      this.addPermission(this.role)
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
    ...mapActions('permissions', ['updatePermission']),
    savePermission (props) {
      if (props) {
        this.updatePermission(props).then((res) => {
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
    validatePermission (val) {
      if (val !== '' || val !== undefined) {
        this.errorPermission = true
        this.errorMessagePermission = 'Deu erro!'
        return false
      }
      this.errorPermission = false
      this.errorMessagePermission = ''
      return true
    },
    ...mapActions('permissions', ['permissionRoles']),
    getPermissions (perm) {
      this.checkOptions(null)
      this.mRoles = true
      this.permissionRoles({ 'id': perm.id })
        .then((res) => {
          this.getPermission = perm
          this.optRoleSel = res.map((q) => q.id)
        })
        .catch((err) => err)
    },
    ...mapActions('roles', ['optionsRoles']),
    checkOptions (q) {
      this.optionsRoles({ 'q': q })
        .then((res) => {
          this.optRoles = res.map((q) => {
            return { 'label': q.label, 'value': q.id }
          })
        })
    },
    ...mapActions('permissions', ['savePermissionRoles']),
    savePermissions (role) {
      this.savePermissionRoles({ 'role': role.id, 'permissions': this.optRoleSel })
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
    ...mapActions('permissions', ['loadPermissions']),
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

      this.loadPermissions({ ...this.params, page })
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
