<template>
<div class="col-12">
  <div v-if='!!user.name'>
    <q-card class="my-card">
      <q-card-section>
        <q-btn flat rounded color="negative" label="Limpar dados" class="float-right" icon="clear" @click.native="resetSearch"/>
        <div class="text-h6">Você está TRANSFERINDO para:</div>
        <div class="text-subtitle2">Destinatário: {{ user.name }}</div>
        <div class="text-subtitle2">
          {{ user.type }}: {{ user.document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1 ****** $4") }}
        </div>
      </q-card-section>
    </q-card>

    <div v-if="errors.amount">{{ errors.amount[0] }}</div>
    <q-input type="number" min="0" @keyup.enter="onTransference" v-model="transference.amount" step="10" label="Valor (em reais)" :dense="false">
      <template v-slot:prepend>
        <q-icon name="local_atm" />
      </template>
      <template v-slot:append>
        <q-icon name="close" @click="transference.amount = ''" class="cursor-pointer" />
      </template>
      <q-tooltip>
        Quanto você quer transferir?
      </q-tooltip>
    </q-input>
    <q-btn color="negative" icon="swap_horiz" label="Transferir" @click.native="onTransference" class="q-mt-md" />
  </div>
    <q-input v-else
      title="Digite um e-mail, CPF ou CNPJ"
      :loading="loadingState"
      filled
      v-model="transference.sender"
      label="Para quem você quer transferir?"
       @keyup.enter="searchUser"
    >
      <template v-slot:append>
        <q-icon name="search" @click.prevent='searchUser' class="cursor-pointer" title="clique para procurar"/>
      </template>
    </q-input>
    <div v-if='errors.sender' class="text-red">{{ errors.sender[0] }}</div>
</div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    transference: {
      required: false,
      type: Object
    }
  },

  data () {
    return {
      loadingState: false,
      user: {},
      message: '',
      errors: {}
    }
  },

  methods: {
    ...mapActions('balances', ['confirmTransference']),
    searchUser () {
      this.reset()
      this.confirmTransference(this.transference.sender)
        .then(res => {
          this.user = res
          this.transference.sender_id = res.id
        })
        .catch(err => {
          this.errors = err.data.errors
        })
    },

    ...mapActions('balances', ['saveTransference']),
    ...mapActions('balances', ['loadUserBalance']),
    onTransference () {
      this.transference.amount = this.transference.amount
      this.saveTransference(this.transference)
        .then((res) => {
          this.message = res.message
          this.$q.notify({
            message: res.message,
            color: 'green-10',
            position: 'center',
            icon: 'done_outline',
            timeout: Math.random() * 5000 + 3000
          })
          this.reset()
          this.loadUserBalance({ 'user_id': res.data.user_id }) // Atualiza o saldo
        })
        .catch(err => {
          this.$q.notify({
            message: err.response.data.message,
            color: 'red-10',
            position: 'center',
            icon: 'error_outline',
            timeout: Math.random() * 5000 + 3000
          })
          this.errors = err.errors
        })
    },

    reset () {
      this.errors = {}
      this.transference.amount = ''
      this.$root.$emit('resetForm')
    },

    resetSearch () {
      this.user = {}
      this.reset()
    }
  }
}
</script>
