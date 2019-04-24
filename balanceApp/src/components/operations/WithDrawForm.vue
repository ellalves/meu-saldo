<template>
<div class="row">
  <div class="col-12">
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6">{{options.bank.name}} *</div>
        <div class="text-subtitle2">Agência: {{options.agency}}<span v-if="options.agency_vd">-{{options.agency_vd}}</span> </div>
        <div class="text-subtitle2">Conta: {{options.number}}<span v-if="options.vd">-{{options.vd}}</span></div>
        <span class="text-caption">(*) Sua conta favorita para alterar clique aqui</span>
      </q-card-section>
    </q-card>
    <div v-if="errors.amount">{{ errors.amount[0] }}</div>
    <q-input type="number" min="0" v-model="withdraw.amount" step="10" label="Valor (em reais)" :dense="false">
      <template v-slot:prepend>
        <q-icon name="local_atm" />
      </template>
      <template v-slot:append>
        <q-icon name="close" @click="withdraw.amount = ''" class="cursor-pointer" />
      </template>
      <q-tooltip>
        Quanto você quer sacar?
      </q-tooltip>
    </q-input>
    <q-btn color="negative" icon="account_balance" label="Sacar" @click.native="onWithDraw" class="q-mt-md" />
  </div>
</div>

</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  props: {
    withdraw: {
      required: false,
      type: Object
    }
  },

  computed: {
    ...mapState('auth', ['me'])
  },

  data () {
    return {
      options: {
        bank: {
          name: 'Banco'
        }
      },
      message: '',
      errors: {}
    }
  },

  created () {
    this.listAccounts()
  },

  methods: {
    ...mapActions('balances', ['saveWithdraw']),
    ...mapActions('balances', ['loadUserBalance']),
    onWithDraw () {
      this.withdraw.amount = this.withdraw.amount
      this.withdraw.sender_id = this.me.id
      this.withdraw.account_id = this.options.id
      console.log('saque', this.withdraw)
      // this.$store.dispatch('withdraw', this.withdraw)
      this.saveWithdraw(this.withdraw)
        .then((res) => {
          this.message = res.message
          this.$q.notify({
            message: res.message,
            color: 'green-10',
            position: 'center',
            icon: 'done_outline',
            timeout: Math.random() * 5000 + 3000
          })
          this.loadUserBalance({ 'user_id': res.data.user_id }) // Atualiza o saldo
        })
        .catch((err) => {
          this.errors = err.data.errors.amount[0]
          console.log('erro', this.errors)
          this.$q.notify({
            message: this.errors,
            color: 'red-10',
            position: 'center',
            icon: 'error_outline',
            timeout: Math.random() * 5000 + 3000
          })
        })
    },

    ...mapActions('accounts', ['loadAccounts']),
    listAccounts () {
      this.loadAccounts({ user_id: this.me.id, 'main': 1 })
        .then((res) => {
          this.options = res.data[0]
        })
    },

    reset () {
      this.errors = {}
      this.withdraw.amount = ''
      this.$emit('resetForm')
    }
  }
}
</script>
