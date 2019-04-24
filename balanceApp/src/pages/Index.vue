<template>
  <q-page class="">
    <!-- Main jumbotron for a primary marketing message or call to action -->
    <q-card class="my-card">
      <img src="assets/meu_saldo720x240.png">

      <q-card-section>
        <div class="text-h6">Bem vindo!</div>
        <div class="text-subtitle2">
          <q-btn color="primary" :to="{name: 'register'}">Cadastre-se</q-btn>
        </div>
        <!-- <div class="text-subtitle2"> <q-btn color="primary" type="a" href="https://saldo.ellalves.net.br/registre-se">Cadastre-se</q-btn> </div> -->
      </q-card-section>

      <q-card-section>
        Esse sistema de SALDOS foi projetado com PHP (Laravel 5.5), Mysql, Javascript e Css (quasar framework).
      </q-card-section>
    </q-card>

    <div class="row">
      <div class="col-xs-12 col-sm-6 col-md-4 q-pa-md">
        <h3 class="text-center text-h6"> Operações </h3>
        <p>
          Nesse sistema é possível, efetuar depósitos, saques e transferencias entre os usuários.
          Os depósitos são eftuados por boleto bancário. Além disso, é possível cadastrar vários endereços
          para cada usuários e atribuir funções e permissões que controlam o que cada um pode fazer no sistema.
        </p>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-4 text-center q-pa-md">
          <h3 class="text-center text-h6">Funções e Permissões</h3>
          <p>
            O nível de acesso pode ser controlado por permisões a determinado recurso ou por grupo de recursos,
            desa forma é possível determinar o que cada usuário pode criar, ver, editar ou deletar.
          </p>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-4 q-pa-md">
        <h3 class="text-center text-h6">Outras funcionalidades</h3>
        <p>
          Notificações: A cada operação o usuário é notificado do que está acontecendo.
        </p>
      </div>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
export default {
  name: 'PageIndex',
  data () {
    return {
      batteryStatus: 'determinando...'
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
