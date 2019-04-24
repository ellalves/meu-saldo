<template>
  <q-page class="q-pa-md">
    <div class="q-ma-md">
      <q-card flat class="col-md-6 col-xs-12">
        <q-card-section>
          <div class="text-h6">Cadastre-se</div>
          <div class="text-subtitle2">Preencha o formulário para efetuar seu cadastro</div>
        </q-card-section>

        <q-card-section>
          <user-form :user="user"></user-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import UserForm from '../../components/utils/UserForm.vue'

export default {
  name: 'Register',
  data () {
    return {
      user: {
        id: '',
        type: '',
        document: '',
        name: '',
        sex: null,
        phone: null,
        celular: null,
        password: '',
        password_confirmation: '',
        terms: null
      },
      errors: {}
    }
  },

  components: {
    UserForm
  }
}
</script>

<style>
</style>
