<template>
  <div>

  </div>
</template>

<script>
import PouchDB from 'pouchdb'

export default {
  created () {
    // this.insert()
  },

  methods: {
    insert () {
      var dbLocal = new PouchDB('local_db')
      dbLocal.get('Mittens').then(function (doc) {
        console.log(doc)
      })
    }
  }
}
</script>
