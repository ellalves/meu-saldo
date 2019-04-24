<template>
  <div class="row gutter-sm q-col-gutter-md">
    <div class="col-xs-12 col-sm-6">
      <q-select v-model="user.type" :options="typeDoc" label="Tipo de Documento" @input="val => { changeDoc(val) }" stack-label />
    </div>
    <div class="col-xs-12 col-sm-6">
      <q-input  v-model="user.document" label="Documento"  :mask="maskDoc" class="no-margin" />
    </div>
    <div :class="modifyField">
      <q-input  v-model="user.name" class="no-margin" label="Nome" />
    </div>
    <div class="col-xs-12 col-sm-6">
      <q-input  v-model="user.phone" type="tel" class="no-margin" label="Telefone" mask="(##)####-####" />
    </div>
    <div class="col-xs-12 col-sm-6">
      <q-input  v-model="user.celular" type="tel" class="no-margin" label="Celular" mask="(##)#####-####" />
    </div>
    <div class="col-xs-12 col-sm-6">
      <q-input  v-model="user.birth" type="date" class="no-margin" label="Data de nascimento" />
    </div>
    <div class="col-xs-12 col-sm-6">
      <div class="captionS">Sexo</div>
      <q-radio v-model="user.sex" val="male" label="Masculino" />
      <q-radio v-model="user.sex" val="female" label="Feminino" />
      <q-radio v-model="user.sex" val="other" label="Outro" />
    </div>
    <div class="col-xs-12 col-sm-6">
      <q-input  v-model="user.email" type="email" class="no-margin" label="E-mail" />
      <span class="text-caption text-red" v-if="errors.email">{{errors.email[0]}}</span>
    </div>
    <div class="col-xs-12 col-sm-6">
      <q-input v-model="user.password" :type="isPwd ? 'password' : 'text'" label="Senha">
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
        <q-tooltip self="top middle">
          Digite sua senha
        </q-tooltip>
      </q-input>
    </div>
    <div class="col-xs-12 col-sm-6" v-if="!update">
      <q-input v-model="user.password_confirmation" :type="isPwdConfirmation ? 'password' : 'text'" label="Confirmar sua senha">
        <template v-slot:append>
          <q-icon
            :name="isPwdConfirmation ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwdConfirmation = !isPwdConfirmation"
          />
        </template>
        <q-tooltip self="top middle">
          Confirme a sua senha
        </q-tooltip>
      </q-input>
    </div>
    <div class="col-md-12 col-xs-12 col-sm-12" v-if="!update">
      <q-toggle
        label="Li e aceito os termos de uso"
        v-model="user.terms"
        checked-icon="check"
        color="green"
        unchecked-icon="clear"
      />
    </div>
    <div class="col-xs-12 col-sm-6 full-width q-mt-md" v-if="update">
      <q-editor v-model="user.about" />
    </div>
    <div :class="[{'full-width': this.$q.platform.is.mobile}, '']">
      <q-btn color="primary" :class="[{'full-width': this.$q.platform.is.mobile}, 'q-mt-xs']" icon="save" label="Salvar" @click.native="save" />
    </div>
    <div :class="[{'full-width': this.$q.platform.is.mobile}, '']">
      <q-btn color="secondary" :class="[{'full-width': this.$q.platform.is.mobile}, 'q-mt-xs']" icon="arrow_back_ios" label="Voltar" @click.native="backHome" />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Register',

  props: {
    user: {
      type: Object,
      required: false
    },
    update: {
      required: false,
      type: Boolean,
      default: false
    }
  },

  created () {
    this.changeDoc('cpf')
  },

  data () {
    return {
      typeDoc: [ 'CNPJ', 'CPF' ],
      maskDoc: null,
      isPwd: true,
      isPwdConfirmation: true,
      errors: {},
      modifyField: [this.update ? 'col-12' : 'col-xs-12 col-sm-6', '']
    }
  },

  computed: {
  },

  methods: {
    ...mapActions('auth', ['registerUser']),
    ...mapActions('auth', ['updateUser']),
    save () {
      console.log('reg', this.user)
      let action = {}
      if (this.update) {
        action = this.updateUser(this.user)
      } else {
        action = this.registerUser(this.user)
      }

      action
        .then((res) => {
          this.$q.notify({
            message: res.message,
            color: 'green-10',
            position: 'center',
            icon: 'done_outline',
            timeout: Math.random() * 5000 + 3000
          })
        })
        .catch((err) => {
          this.errors = err.response.data.errors
          this.$q.notify({
            message: 'Oooops! Ocorreu um erro inesperado.',
            color: 'red-10',
            position: 'center',
            icon: 'error_outline',
            timeout: Math.random() * 5000 + 3000
          })
        })
    },

    verifyDoc (val) {
      if (val === 'cpf' || val === 'CPF') {
        this.maskDoc = '###.###.###-##'
      } else if (val === 'cnpj' || val === 'CNPJ') {
        this.maskDoc = '##.###.###/####-##'
      }
    },

    changeDoc (val) {
      this.verifyDoc(val)
    },

    backHome () {
      this.$router.push({ name: 'home' })
    }
  }
}
</script>

<style>
</style>
