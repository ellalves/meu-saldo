import PouchDB from 'pouchdb'
import PouchFind from 'pouchdb-find'
// import PouchAuth from 'pouchdb-authentication'
PouchDB.plugin(PouchFind)

export default async ({
  Vue
}) => {
  Vue.prototype.$pouchDB = new PouchDB('eva_localdb')

  // Substituir por instância remota, isso apenas é replicado para outra instância local.
  Vue.prototype.$remoteCouch = 'eva_fernandes'
}
