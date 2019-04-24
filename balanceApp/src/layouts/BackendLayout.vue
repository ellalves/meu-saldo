<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar
        color="primary"
        :glossy="$q.theme === 'mat'"
        :inverted="$q.theme === 'ios'"
      >
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title :to="{ name: 'home'}">
          <q-btn flat push type="a" href="/">Meu Saldo</q-btn>
          <span slot="subtitle">
            Sistema de saldos
          </span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list>
        <q-item-label header>NAVEGAÇÃO</q-item-label>

        <q-item clickable v-ripple :to="{name: 'change-image'}">
          <q-item-section avatar>
            <menu-image :user="me"></menu-image>
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">{{me.name}}</q-item-label>
            <q-item-label caption lines="2">
              <span class="text-weight-bold">{{me.document}}</span>
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator inset="item" />

        <q-item :to="{ name: 'home'}">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Home</q-item-label>
            <q-item-label caption>Página inicial</q-item-label>
          </q-item-section>
        </q-item>
        <q-item  :to="{ name: 'my-profile'}">
          <q-item-section avatar>
            <q-icon name="perm_identity" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Meu perfil</q-item-label>
            <q-item-label caption>Alterar dados</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable :to="{name: 'change-password'}">
          <q-item-section avatar>
            <q-icon name="security" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Alterar senha</q-item-label>
            <q-item-label caption>mudar sua senha</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable :to="{name: 'roles'}" v-if="can('list_roles')">
          <q-item-section avatar>
            <q-icon name="supervisor_account" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Funções</q-item-label>
            <q-item-label caption>Funções dos usuários</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable :to="{name: 'permissions'}" v-if="can('list_permissions')">
          <q-item-section avatar>
            <q-icon name="lock_open" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Permissões</q-item-label>
            <q-item-label caption>Permissões dos usuários</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable :to="{name: 'users'}" v-if="can('list_users')">
          <q-item-section avatar>
            <q-icon name="wc" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Usuários</q-item-label>
            <q-item-label caption>Gerenciar usuários</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable :to="{name: 'tickets'}" v-if="can('list_billets')">
          <q-item-section avatar>
            <q-icon name="local_offer" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Boletos</q-item-label>
            <q-item-label caption>Gerenciar boletos dos usuários</q-item-label>
          </q-item-section>
        </q-item>

        <q-item  @click.native="logoutUser">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Sair</q-item-label>
            <q-item-label caption>Encerrar sessão</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { Loading, LocalStorage } from 'quasar'
import { mapState, mapActions } from 'vuex'
import MenuImage from '../components/layouts/MenuImage.vue'

export default {
  name: 'BackendLayout',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },

  created () {
    this.loggedIn()
  },

  computed: {
    ...mapState('auth', ['me'])
  },

  methods: {
    ...mapActions('auth', ['logout']),
    logoutUser () {
      this.logout()
      this.$router.push({ name: 'login' })
    },

    ...mapActions('balances', ['loadUserBalance']),
    userBalance () {
      this.loadUserBalance({ user_id: this.me.id })
    },

    ...mapActions('auth', ['checkLogin']),
    loggedIn () {
      if (LocalStorage.getItem(process.env.NAME_TOKEN) != null) {
        Loading.show({ message: 'Aguarde ...' })
        this.checkLogin().then(() => {
          this.userBalance()
        }).catch(() => {
          this.logoutUser()
          this.$router.push({ name: 'login' })
        }).finally(() => Loading.hide())
      } else {
        this.$router.push({ name: 'login' })
      }
    }
  },

  components: {
    MenuImage
  }
}
</script>

<style>
</style>
