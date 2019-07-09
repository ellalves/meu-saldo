<template>
  <div class="row gutter-sm q-col-gutter-md">
    <div :class="modifyField">
      <q-input
        v-model="user.name"
        label="Nome"
        class="no-margin"
        :rules="[val => !!val || 'Campo obrigatório!']"
      />
    </div>
    <div class="col-xs-12 col-sm-6">
      <q-input
        v-model="user.username"
        label="Usuário"
        class="no-margin"
        :rules="[ checkUsername ]"
      />
    </div>

    <div class="col-xs-12 col-sm-6">
      <q-input v-model="user.phone" type="tel" class="no-margin" label="Celular" mask="(##)#####-####" />
    </div>
    <div class="col-xs-12 col-sm-6">
      <q-input v-model="user.birth" type="date" class="no-margin" label="Data de nascimento" />
    </div>
    <div class="col-xs-12 col-sm-6">
      <div class="caption">Sexo</div>
        <q-option-group
          :options="options"
          label="Notifications"
          type="radio"
          v-model="user.sex"
          :rules="[val => !!val || 'O Campo é obrigatório!']"
        />
    </div>
    <div class="col-xs-12 col-sm-6">
      <q-input
        v-model="user.email"
        type="email"
        label="E-mail"
        class="no-margin"
        :rules="[ checkEmail ]"
      />
      <span class="text-caption text-red" v-if="errors.email">{{errors.email[0]}}</span>
    </div>

    <div class="col-xs-12 col-sm-6">
      <q-select v-model="user.role" :options="roles" label="Grupo" />
    </div>

    <div class="col-xs-12 col-sm-6">
      <q-input
        v-model="user.password"
        :type="isPwd ? 'password' : 'text'"
        label="Senha"
        :rules="[val => !!val || 'Campo obrigatório!']"
      >
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
    <div class="col-xs-12 col-sm-6" v-if="!isUpdate">
      <q-input
        v-model="user.password_confirmation"
        :type="isPwdConfirmation ? 'password' : 'text'"
        label="Confirmar sua senha"
        :rules="[ checkConfirmPassword ]"
      >
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
    <div class="col-xs-12 col-sm-6 full-width q-mt-md" v-if="isUpdate">
      <q-input v-model="user.about" autogrow placeholder="Sobre mim" type="textarea" />
    </div>
    <div :class="[{'full-width': this.$q.platform.is.mobile}, '']">
      <q-btn color="primary" :class="[{'full-width': this.$q.platform.is.mobile}, 'q-mt-xs']" icon="save" label="Salvar" @click.native="save" />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { dateTime } from '../mixins/dateTime'

export default {
  name: 'Register',

  props: {
    user: {
      type: Object,
      required: false
    },
    isUpdate: {
      required: false,
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      isPwd: true,
      isPwdConfirmation: true,
      errors: {},
      options: [
        { label: 'Masculino', value: 'male', color: 'blue' },
        { label: 'Feminino', value: 'female', color: 'pink' },
        { label: 'Outros', value: 'other', color: 'grey' }
      ],
      roles: [
        'Administrador', 'Cliente', 'Funcionário', 'Membro'
      ],
      modifyField: [this.isUpdate ? 'col-12' : 'col-xs-12 col-sm-6', '']
    }
  },

  methods: {
    ...mapActions('auth', ['create', 'read', 'search', 'update']),
    checkUsername (val) {
      if (val === '') {
        return 'O Campo é obrigatório!'
      } else if (val) {
        let obj = {
          fields: ['_id', 'usename'],
          selector: {
            username: val,
            _id: { $ne: this.user._id }
          }
          // use_index: ['username'],
        }
        return this.search(obj).then((res) => {
          if (res !== undefined && res.length === 1) {
            return 'O usuário já está cadastrado!'
          }
        })
      }
    },
    checkEmail (val) {
      if (val === '') {
        return 'O Campo é obrigatório!'
      } else if (val) {
        let obj = {
          fields: ['_id', 'email'],
          selector: {
            email: val,
            _id: { $ne: this.user._id }
          }
        }
        return this.search(obj).then((res) => {
          let len = res !== undefined ? res.length : 0
          if (len === 1) {
            return 'O email já está cadastrado!'
          }
        })
      }
    },

    checkConfirmPassword (val) {
      if (val === '') {
        return 'O Campo é obrigatório!'
      } else if (val !== this.user.password) {
        return 'As senhas não são iguais!'
      }
    },

    save () {
      var bcrypt = require('bcryptjs')
      let action = null
      if (this.isUpdate) {
        let hash = bcrypt.hashSync(this.user.password, bcrypt.genSaltSync(10))
        let obj = {
          '_id': this.user._id,
          'name': this.user.name,
          'username': this.user.username,
          'password': hash,
          'email': this.user.email,
          'sex': this.user.sex,
          'role': this.user.role,
          'birth': this.user.birth,
          'phone': this.user.phone,
          'image': this.user.image,
          'modified': this.formatDateTimeDb(new Date())
        }
        action = this.update(obj)
      } else {
        let hash = bcrypt.hashSync(this.user.password, bcrypt.genSaltSync(10))
        let obj = {
          '_id': new Date().toISOString(),
          'name': this.user.name,
          'username': this.user.username,
          'password': hash,
          'email': this.user.email,
          'sex': this.user.sex,
          'role': this.user.role,
          'birth': this.user.birth,
          'phone': this.user.phone,
          'image': this.user.image,
          'created': this.formatDateTimeDb(new Date())
        }
        action = this.create(obj)
      }

      action
        .then(() => {
          this.$q.notify({
            message: 'Usuário criado com sucesso!',
            color: 'green-10',
            position: 'center',
            icon: 'done_outline',
            timeout: Math.random() * 5000 + 3000
          })

          this.$router.push({ name: 'login' })
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

    backHome () {
      this.$router.push({ name: 'home' })
    }
  },

  mixins: [dateTime]
}
</script>

<style>
</style>
