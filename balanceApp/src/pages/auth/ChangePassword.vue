<template>
  <q-page class="q-pa-md">
    <div class="q-ma-md">
      <q-card flat class="col-md-6 col-xs-12">
        <q-card-section>
          <div class="text-h6">Alterar senha</div>
          <div class="text-subtitle2">Preencha o formulário para alterar senha</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="user.password_old" label="Senha antiga"
            :type="isPwdOld ? 'password' : 'text'"
            @blur="$v.user.password_old.$touch"
            @keyup.enter="modifyPassword"
            :error="$v.user.password_old.$error"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwdOld ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwdOld = !isPwdOld"
              />
            </template>
          </q-input>
          <span class="text-caption text-red" v-if="errors.password_old">{{errors.password_old[0]}}</span>

          <q-input v-model="user.password_new" label="Nova senha"
            :type="isPwdNew ? 'password' : 'text'"
            @blur="$v.user.password_new.$touch"
            @keyup.enter="modifyPassword"
            :error="$v.user.password_new.$error"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwdNew ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwdNew = !isPwdNew"
              />
            </template>
          </q-input>
          <span class="text-caption text-red" v-if="errors.password_new">{{errors.password_new[0]}}</span>

          <q-input v-model="user.password_new_confirmation" label="Confirme a senha"
            :type="isPwdConfirm ? 'password' : 'text'"
            @blur="$v.user.password_new_confirmation.$touch"
            @keyup.enter="modifyPassword"
            :error="$v.user.password_new_confirmation.$error"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwdConfirm ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwdConfirm = !isPwdConfirm"
              />
            </template>
          </q-input>
          <span class="text-caption text-red" v-if="errors.password_new_confirmation">{{errors.password_new_confirmation[0]}}</span>

          <q-space />
          <q-btn color="primary" :class="[{'full-width': this.$q.platform.is.mobile}, 'q-mt-md']" label="Alterar" @click.native="modifyPassword" />
        </q-card-section>
      </q-card>
    </div>
</q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { required } from 'vuelidate/lib/validators'
export default {
  name: 'ChangePassword',

  computed: {
    ...mapState('auth', ['me'])
  },

  data () {
    return {
      user: {
        id: '',
        password_new: '',
        password_new_confirmation: '',
        password_old: ''
      },
      isPwdOld: true,
      isPwdNew: true,
      isPwdConfirm: true,
      errors: {}
    }
  },

  validations: {
    user: {
      password_new: { required },
      password_new_confirmation: { required },
      password_old: { required }
    }
  },

  methods: {
    ...mapActions('auth', ['changePassword']),
    modifyPassword () {
      this.$v.user.$touch()
      this.user.id = this.me.id
      this.changePassword(this.user)
        .then((res) => {
          this.$q.notify({
            message: res.message,
            color: 'green-10',
            position: 'center',
            icon: 'done_outline',
            timeout: Math.random() * 5000 + 3000
          })
        })
        .catch((errors) => {
          this.errors = errors.status ? errors.data.errors : errors
          this.$q.notify({
            message: 'Oooops! Ocorreu um erro inesperado.',
            color: 'red-10',
            position: 'center',
            icon: 'error_outline',
            timeout: Math.random() * 5000 + 3000
          })
        })
    }
  }
}
</script>

<style scoped>
</style>
