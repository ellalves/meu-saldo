<template>
<div class="row">
  <div class="col-12">
    <p v-if="!!message" class="text-success"><strong>{{ message }}</strong></p>
    <div v-if="!!billet.id">
      <q-btn outline rounded color="primary" type="a" target="_blank" label="Efetuar pagamento" :href="'https://saldo.ellalves.net.br/boleto/' + billet.id" />
    </div>
    <div v-if="errors.amount">{{ errors.amount[0] }}</div>
    <q-input type="number" min="0" v-model="deposit.amount" step="10" label="Valor (em reais)" :dense="false">
      <template v-slot:prepend>
        <q-icon name="local_atm" />
      </template>
      <template v-slot:append>
        <q-icon name="close" @click="deposit.amount = ''" class="cursor-pointer" />
      </template>
      <q-tooltip>
        Quanto você quer deposistar?
      </q-tooltip>
    </q-input>
    <q-btn color="primary" icon="account_balance_wallet" label="Depositar" @click.native="generateBillet" class="q-mt-md" />
  </div>
</div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    deposit: {
      type: Object,
      required: false,
      default: () => {}
    }
  },

  data () {
    return {
      errors: {},
      message: '',
      billet: {}
    }
  },

  computed: {
    user () {
      return this.$store.state.auth.me
    },

    amount () {
      return this.$store.state.balances.balance.amount
    }
  },

  methods: {
    ...mapActions('balances', ['loadUserBalance']),
    ...mapActions('billets', ['ticket']),
    generateBillet () {
      this.billet.payer = this.user.id
      this.billet.receiver = this.user.receiver
      this.billet.deposit_id = 100000
      this.billet.wallet = 11
      this.billet.agreement = 123456
      this.billet.price = this.deposit.amount
      this.billet.before_amount = this.amount ? this.amount : '0.00'
      this.ticket(this.billet)
        .then((res) => {
          this.$q.notify({
            message: 'Boleto gerado com sucesso. O pagamento será confirmado três dias após o pagemento!',
            color: 'green-10',
            position: 'center',
            icon: 'done_outline',
            timeout: Math.random() * 5000 + 3000
          })
          this.billet = res.data
          this.reset()
        })
        .catch((err) => {
          this.$q.notify({
            message: err.data,
            color: 'red-10',
            position: 'center',
            icon: 'error_outline',
            timeout: Math.random() * 5000 + 3000
          })
        })

      this.billet.id = 1 // retorno
    },

    reset () {
      this.errors = {}
      this.deposit.amount = ''
      this.$emit('resetForm')
    }
  }
}
</script>
