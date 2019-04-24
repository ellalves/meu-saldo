<template>
  <q-page padding>
    <q-banner inline-actions class="text-white bg-red">
      <template v-slot:avatar>
        <q-icon name="highlight_off" />
      </template>
      Você não tem permissão para acessar essa página!
      <template v-slot:action>
        <q-btn flat :to="{ name: 'home' }" label="Retornar a home" />
      </template>
    </q-banner>
  </q-page>
</template>

<script>
export default {
  name: 'NotAuthorized'
}
</script>

<style>
</style>
