import Vue from 'vue'

/**
 * Insere dados no banco
 *
 * @param  {Object} obj
 * @return {promess}
 */
const PUT = (obj) => {
  return new Promise((resolve, reject) => {
    Vue.prototype.$pouchDB.put(obj).then(function (response) {
      console.log('response', response)
      return response
    }).catch(function (err) {
      console.log('ero', err)
      return err
    })
  })
}

const GET = (obj) => {
  return new Promise((resolve, reject) => {
    Vue.prototype.$pouchDB.get(obj.id).then(function (doc) {
      console.log(doc)
      return doc
    }).catch(function (err) {
      console.log(err)
      return err
    })
  })
}

const READ = (obj) => {
  console.log(Vue.prototype.$pouchDB)
  return new Promise((resolve, reject) => {
    Vue.prototype.$pouchDB.find({
      selector: obj.selector,
      fields: obj.fields,
      sort: obj.sort,
      limit: obj.limit,
      use_index: obj.use_index
    }).then(function (result) {
      console.log('result', result)
      return resolve(result.docs)
    }).catch(function (err) {
      console.log(err)
      return reject(err)
    })
  })
}

const SHOW_ALL = () => {
  return new Promise((resolve, reject) => {
    Vue.prototype.$pouchDB.allDocs({
      include_docs: true,
      descending: true
    }, function (err, doc) {
      return err
    })
  })
}

export {
  PUT,
  GET,
  READ,
  SHOW_ALL
}
