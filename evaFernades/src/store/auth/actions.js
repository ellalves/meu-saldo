import {
  PUT,
  GET,
  READ
} from '../../components/database/pouchdb.js'

// import {
//   LocalStorage,
//   SessionStorage
// } from 'quasar'

const create = ({ commit }, params) => {
  let data = PUT(params)
  console.log('READ', data)
  return data
}

const login = ({ commit }, obj) => {
  let data = READ(obj)
  // console.log('data', data)
  return data.then((res) => {
    console.log('res', res)
    if (res.length === 1) {
      return res
    }
  })
}

const logout = ({ commit }) => {
  commit('LOGOUT_USER')
  // SessionStorage.remove('AUTH')
  // LocalStorage.remove('AUTH')
}

const search = ({ commit }, obj) => {
  console.log('obj', obj)
  let data = READ(obj)
  commit('LOAD_USERS', data)
  return data
}

const get = ({ commit }, obj) => {
  console.log('obj', obj)
  let data = GET(obj)
  commit('LOAD_USER', data)
  return data
}

const update = ({ commit }, params) => {
  // alert('params1 ' + JSON.stringify(params))
  let data = PUT(params)
  return data
}

export {
  create,
  login,
  logout,
  get,
  search,
  update
}
