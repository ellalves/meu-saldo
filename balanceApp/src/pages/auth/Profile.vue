<template>
  <q-page class="q-pa-md">
    <div class="q-ma-md">
      <q-card flat class="col-md-6 col-xs-12">
        <q-card-section>
          <div class="text-h6">Meu perfil</div>
          <div class="text-subtitle2">Preencha o formulário para alterar seus dados</div>
        </q-card-section>

        <q-card-section>
          <user-form :user="me" :update="true"></user-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import UserForm from '../../components/utils/UserForm.vue'

export default {
  name: 'Profile',

  data () {
    return {}
  },

  computed: {
    ...mapState('auth', ['me'])
  },

  components: {
    UserForm
  }
}
</script>

<style>
</style>
