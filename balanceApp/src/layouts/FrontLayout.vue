<template>
  <!-- Configure "view" prop for QLayout -->
  <q-layout>
    <q-header v-model="header" class="gutter-none">

      <q-toolbar color="blue-5" class="row q-pr-sm col-12">
        <!--
          Toggles QLayout left side
          (Assuming the Drawer has a model bound to "leftSide")
        -->
        <!-- <q-btn
          flat round dense
          icon="menu"
          @click="leftSide = !leftSide"
        /> -->
        <q-toolbar-title :to="{ name: 'home'}">
          <q-btn flat push type="a" href="/">Meu Saldo</q-btn>
          <span slot="subtitle">
            Sistema de saldos
          </span>
        </q-toolbar-title>
        <q-space />
        <div  v-if="isLogged">
          <q-btn-dropdown   v-if="can('deposit') || can('transfer') || can('withdraw')"
            flat
            :label="balance.amount ? 'R$ ' + balance.amount : '0,00'"
          >
            <q-list>
              <q-item clickable v-close-menu v-if="can('deposit')">
                <q-item-section avatar>
                  <q-avatar icon="account_balance_wallet" color="positive" text-color="white" />
                </q-item-section>
                <q-item-section @click.native="mBalance = true">
                  <q-item-label>Depósito </q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-menu v-if="can('transfer')">
                <q-item-section avatar>
                  <q-avatar icon="swap_horiz" color="warning" text-color="white" />
                </q-item-section>
                <q-item-section @click.native="mTransfer = true">
                  <q-item-label>Transferência</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-menu v-if="can('withdraw')">
                <q-item-section avatar>
                  <q-avatar icon="account_balance" color="negative" text-color="white" />
                </q-item-section>
                <q-item-section @click="mWithDraw = true">
                  <q-item-label>Saque</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>

          <q-btn flat round>
            <q-avatar size="42px">
              <img :src="['https://saldo.ellalves.net.br/storage/profiles/']+me.image">
            </q-avatar>
            <q-menu transition-show="jump-down" transition-hide="jump-up">
              <div class="row no-wrap q-pa-md">
                <div class="column">
                    <q-list>
                      <q-item  :to="{ name: 'dashboard'}">
                        <q-item-section avatar>
                          <q-icon name="dashboard" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>Painel</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item :to="{ name: 'my-profile' }">
                        <q-item-section avatar>
                          <q-icon name="perm_identity" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>Meu perfil</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item :to="{ name: 'change-password'}">
                        <q-item-section avatar>
                          <q-icon name="security" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>Alterar senha</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                </div>
                <q-separator vertical inset class="q-mx-lg" />
                <div class="column items-center">
                  <q-btn flat :to="{name: 'change-image'}" >
                    <menu-image :user="me" />
                  </q-btn>

                  <div class="text-subtitle1 q-mt-md q-mb-xs">{{me.name}}</div>

                  <q-btn
                    color="red"
                    icon="exit_to_app"
                    label="Sair"
                    push
                    size="sm"
                    @click.native="logoutUser"
                  />
                </div>
              </div>
            </q-menu>
          </q-btn>
        </div>
        <q-btn flat dense icon="person" :to="{name: 'login'}" v-else />
      </q-toolbar>
    </q-header>

    <!--// Depósito //-->
    <q-dialog v-model="mBalance" v-if="can('deposit')">
      <q-card color="grey-1" style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center">
          <div class="text-h6">Fazer Depósito</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-dialog />
        </q-card-section>

        <q-card-section>
          <deposit-form @reset="resetForm" :deposit="depositForm"></deposit-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!--// Transferência //-->
    <q-dialog v-model="mTransfer" v-if="can('transfer')">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center">
          <div class="text-h6">Fazer Transferência</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <transference-form @reset="resetForm" :transference="transferenceForm"></transference-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!--// Saque //-->
    <q-dialog v-model="mWithDraw" v-if="can('withdraw')">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center">
          <div class="text-h6">Fazer Saque</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-dialog />
        </q-card-section>

        <q-card-section>
          <with-draw-form @reset="resetForm" :withdraw="withdrawForm"></with-draw-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Footer -->
    <q-footer v-model="footer">
      <!-- footer content -->
      <q-toolbar>
        Todos os direitos reservados a WebXpertise
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import DepositForm from '../components/operations/DepositForm.vue'
import TransferenceForm from '../components/operations/TransferenceForm.vue'
import WithDrawForm from '../components/operations/WithDrawForm.vue'
import MenuImage from '../components/layouts/MenuImage.vue'
import { LocalStorage } from 'quasar'

export default {
  created () {
    this.loggedIn()
  },

  data () {
    return {
      mBalance: false,
      mTransfer: false,
      mWithDraw: false,
      depositForm: {},
      transferenceForm: {
        sender: '',
        sender_id: 0
      },
      withdrawForm: {},
      header: true,
      footer: true
    }
  },

  computed: {
    ...mapGetters('auth', ['isLogged']),
    ...mapGetters('auth', ['token']),
    ...mapState('auth', ['LOAD_USER']),
    ...mapState('balances', ['balance']),
    ...mapState('auth', ['me'])
  },

  methods: {
    checkFileSize (files) {
      return files.filter(file => file.size < 2048)
    },
    ...mapActions('balances', ['loadUserBalance']),
    userBalance () {
      this.loadUserBalance({ user_id: this.me.id })
    },

    ...mapActions('auth', ['logout']),
    logoutUser () {
      this.logout()
      this.$router.push({ name: 'login' })
    },

    ...mapActions('auth', ['checkLogin']),
    loggedIn () {
      if (LocalStorage.getItem(process.env.NAME_TOKEN) != null) {
        this.checkLogin().then(() => {
          this.userBalance()
        }).catch(() => {
          this.logoutUser()
          this.$router.push({ name: 'login' })
        })
      }
    },

    resetForm () {
      this.depositForm = {}
      this.transferenceForm = {}
      this.withdrawForm = {}
    }
  },
  components: {
    DepositForm,
    TransferenceForm,
    WithDrawForm,
    MenuImage
  }
}
</script>

<style>
</style>
