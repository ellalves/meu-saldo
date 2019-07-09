<template>
  <q-page>
    <q-toolbar class="bg-secondary text-white shadow-2">
      <q-toolbar-title>
        <q-btn flat icon="keyboard_arrow_left" v-go-back.single />
        Entrar
      </q-toolbar-title>
      <q-btn flat left dense icon="send" class="cursor-pointer" @click.native="loginUser" />
    </q-toolbar>
    <div class="row flex-center">
      <q-card flat class="col-md-4 col-sm-8 col-xs-12 q-ma-md">
          <q-card-section>
            <div class="text-subtitle2">Preencha o formulário para acessar a área restrita</div>
          </q-card-section>

        <q-card-section>
          <q-input
            v-model="user.email"
            type="email"
            label="E-mail"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Digite um e-mail!']"
        />
          <q-input
            v-model="user.password"
            :type="isPwd ? 'password' : 'text'"
            label="Senha"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Digite uma senha!']"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <q-toggle
            v-model="rememberMe"
            checked-icon="check"
            color="green"
            unchecked-icon="clear"
            label="Salvar os dados da sessão"
          />

          <q-btn color="primary" class="full-width q-mt-md" label="Entrar" icon-right="send" @click.native="loginUser" />
          <q-btn color="accent" class="full-width q-mt-md" label="Cadastre-se" icon-right="person_add" :to="{ name: 'register' }" />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'Login',

  mounted () {
    if (this.isLogged()) {
      this.$router.push({ name: 'profile' })
    }
  },

  data () {
    return {
      user: {
        email: '',
        password: ''
      },
      me: [],
      isPwd: true,
      rememberMe: false
    }
  },

  methods: {
    ...mapGetters('auth', ['isLogged', 'login']),
    ...mapActions('auth', ['login']),
    ...mapMutations('auth', { add: 'LOGIN_USER' }),
    loginUser () {
      var bcrypt = require('bcryptjs')
      let obj = {
        selector: {
          email: this.user.email
        },
        limit: 1
      }
      // console.log('obj', obj)
      this.login(obj).then((me) => {
        let hash = bcrypt.compareSync(this.user.password, me[0].password)
        if (hash) {
          this.add(me[0]) // Coloca os dados do usuário no state
          // this.rememberMe ? this.$q.localStorage.set('AUTH', this.me[0]) : this.$q.sessionStorage.set('AUTH', this.me[0])
          this.$router.push({ name: 'profile' }) // Redireciona
        } else {
          this.$q.notify({
            message: 'Senha inválida!',
            type: 'negative',
            color: 'negative',
            icon: 'error_outline',
            position: 'center'
          })
        }
      }).catch(() => {
        this.$q.notify({
          message: 'E-mail inválido!',
          type: 'negative',
          color: 'negative',
          icon: 'error_outline',
          position: 'center'
        })
      })
    }
  }
}
</script>

<style>
</style>
