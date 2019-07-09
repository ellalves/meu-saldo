<template>
  <div>

  </div>
</template>

<script>
import PouchDB from 'pouchdb'
import PouchAuth from 'pouchdb-authentication'

export default {
  created () {
    this.create()
  },

  methods: {
    create () {
      PouchDB.plugin(PouchAuth)

      var dbRemote = new PouchDB('http://35.232.66.91:5984/remote_db', {
        skip_setup: true
      })
      var dbLocal = new PouchDB('local_db')

      dbRemote.signUp('ellalves', '+9857rose', {
        metadata: {
          email: 'everton@webxpertise.com.br',
          birthday: '1932-03-27T00:00:00.000Z',
          likes: ['acrobatics', 'short pants', 'sidekickin\'']
        }
      }).then(result => {
        return dbRemote.logIn('ellalves', '+9857rose')
      }).then(result => {
        dbLocal.sync(dbRemote, {
          live: true,
          retry: true
        })
      })
    },
    sync (url) {
      var opts = { live: true, retry: true }

      // fazer uma maneira, sincronização única do servidor até a conclusão
      db.replicate.from(url).on('complete', function(info) {
        // então sincronização bidirecional contínua e repetível
        db.sync(url, opts)
          .on('change', onSyncChange)
          .on('paused', onSyncPaused)
          .on('error', onSyncError)
      }).on('error', onSyncError)
    }
  }
}
</script>
