<template>
<q-page class="container q-pa-xs">
  <!-- content -->
  <!-- <h1>Postagens</h1> -->
  <div class="row gutter-sm">
    <div class="col-lg-4 col-xs-12" v-for="artigo in 10" :key="artigo">
      <q-card>
        <q-card-media>
          <img src="~assets/quasar-logo-full.svg"  class="q-pa-lg" alt="">
        </q-card-media>
          <q-card-title>
            Titulo do artigo
          </q-card-title>
          <q-card-separator />
          <q-card-main>
            Resumo do artigo
          </q-card-main>
          <q-card-actions>
            <q-btn color="dark" label="Detalhes" class="full-width" />
          </q-card-actions>
      </q-card>
    </div>
  </div>
</q-page>
</template>

<script>
export default {
  name: 'Posts'
}
</script>

<style>
</style>
