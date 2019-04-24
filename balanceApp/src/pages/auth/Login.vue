<template>
  <q-page class="row flex-center">
    <q-card class="col-md-4 col-sm-8 col-xs-12">
      <q-img src="statics/meu_saldo-logo.png" class="q-pa-md">
        <div class="absolute-bottom">
          <div class="text-h6">Login</div>
          <div class="text-subtitle2">Preencha o fromulário para acessar a área restrita</div>
        </div>
      </q-img>

      <q-card-section>
        <q-input v-model="user.email" type="email" label="E-mail"
          @blur="$v.user.email.$touch"
          @keyup.enter="loginUser"
          :error="$v.user.email.$error"
      />
        <q-input v-model="user.password" :type="isPwd ? 'password' : 'text'" label="Senha"
          @blur="$v.user.password.$touch"
          @keyup.enter="loginUser"
          :error="$v.user.password.$error"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <q-btn color="primary" class="full-width q-mt-md" label="Entrar" icon-right="send" @click.native="loginUser" />
        <q-btn color="accent" class="full-width q-mt-md" label="Cadastre-se" icon-right="person_add" :to="{ name: 'register' }" />
        <q-btn color="secondary" class="full-width q-mt-md" label="Voltar" icon="arrow_back_ios" :to="{ name: 'home' }" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { required, email } from 'vuelidate/lib/validators'

export default {
  name: 'Login',

  mounted () {
    if (this.isLogged()) {
      this.$router.push({ name: 'dashboard' })
    }
  },

  data () {
    return {
      user: {
        email: '',
        password: ''
      },
      isPwd: true
    }
  },

  validations: {
    user: {
      email: { required, email },
      password: { required }
    }
  },

  methods: {
    ...mapGetters('auth', ['isLogged']),
    ...mapActions('auth', ['login']),
    loginUser () {
      this.$v.user.$touch()
      if (this.$v.user.email.$error) {
        this.$q.notify({
          message: 'Digite um e-mail válido!',
          icon: 'error',
          position: 'center'
        })
        return
      }

      if (this.$v.user.password.$error) {
        this.$q.notify({
          message: 'A senha não pode ser vazia!',
          icon: 'error',
          position: 'center'
        })
        return
      }

      this.login(this.user).then(() => {
        this.$router.push({ name: 'dashboard' })
      }).catch(() => {
        this.$q.notify({
          message: 'E-mail ou senha inválidos!',
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
