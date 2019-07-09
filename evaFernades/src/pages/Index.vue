<template>
  <q-page class="flex flex-center">
    <img alt="Quasar logo" src="~assets/quasar-logo-full.svg">
  </q-page>
</template>

<style>
</style>

<script>
import PouchDB from 'pouchdb'

export default {
  name: 'PageIndex',

  created () {
    // this.sync()
  },

  methods: {
    sync () {
      var db = new PouchDB('local_db')

      db.put({
        _id: 'daniel@gmail.com',
        name: 'Daniel Fernandes',
        age: 13
      })

      db.changes().on('change', function () {
        console.log('Ch-Ch-Changes')
      })

      db.replicate.to('http://35.232.66.91:5984/eva_fernandes')
    }
  }
}
</script>
