<template>
  <q-page>
    <p class='q-pa-md'>
      Fazer suas compras está mais fácil com o aplicativo MINHAS COMPRAS. Nele você pode:
      <ul>
        <li> Cadastrar usuários;</li>
        <li> Cadastrar e editar produtos;</li>
        <li> Cadastrar e editar marca de produtos;</li>
        <li> Cadastrar e editar lojas;</li>
        <li> Criar e excluir listas de products.</li>
      </ul>
      Agora, você consegue saber quanto vai pagar pela suas compras ao chegar ao caixa!
    </p>
      <strong class='q-pa-md'>
        Regra de uso
      </strong>
    <p class='q-pa-md'>
      Para ter uma melhor experiência com nosso app, siga os passos seguintes:
      <ol>
        <li>cadastre um usuário</li>
        <li>efetur o login com os dados que você cadastrou!</li>
        <li>cadastre as marcas dos produtos</li>
        <li>cadastre os produtos</li>
        <li>cadastre as lojas</li>
        <li>Feito isso, crie uma lista e logo após clique na lista para adicionar seus itens!</li>
      </ol>
    </p>
    <q-toolbar class="q-pt-md bg-primary text-white">
      <p>
        Desenvolvido por <a href="https://ellalves.net.br" class="text-white">Ell Alves</a>. <br>
        Direitos reservados a WebXpertise.
      </p>

    </q-toolbar>
  </q-page>
</template>

<style>
</style>

<script>
// import { mapActions } from 'vuex'
var wentOffline, wentOnline
function handleConnectionChange (event) {
  if (event.type === 'offline') {
    console.log('Você perdeu a conexão.')
    wentOffline = new Date(event.timeStamp)
  }
  if (event.type === 'online') {
    console.log('Você está agora de volta online.')
    wentOnline = new Date(event.timeStamp)
    console.log('Você estava off-line para ' + (wentOnline - wentOffline) / 1000 + ' segundos')
  }
  console.log(new Date(event.timeStamp))
}
window.addEventListener('online', handleConnectionChange)
window.addEventListener('offline', handleConnectionChange)

export default {
  name: 'PageIndex',

  created () {
    // this.loaded()
  },

  data () {
    return {
      // db: null,
    }
  },

  computed: {
  },

  methods: {
    // loaded () {
    //   if (navigator.onLine) {
    //     console.log('online')
    //   } else {
    //     console.log('offline')
    //   }
    // }
  }
}
</script>
