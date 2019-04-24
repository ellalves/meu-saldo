
import Vue from 'vue'
import { Loading, QSpinnerGears } from 'quasar'

const BASE_URL = process.env.BASE_URL + '/auth'

const loadRoles = ({
  commit
}, params) => {
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.get(`${BASE_URL}/roles`, { params })
      .then((res) => {
        commit('LOAD_ROLES', res.data)
        resolve(res.data)
      })
      .catch(errs => reject(errs.response))
  })
}

const loadRole = ({
  commit
}, params) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.get(`${BASE_URL}/roles/${params.id}`, { params })
      .then((res) => {
        commit('LOAD_PERMISSION', res.data)
        resolve(res.data)
      })
      .catch(errs => reject(errs.response))
      .finally(() => Loading.hide())
  })
}

const optionsRoles = ({ commit }, params) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.get(`${BASE_URL}/roles/get-roles`, { params })
      .then((res) => {
        resolve(res.data)
      })
      .catch(errs => reject(errs.response))
      .finally(() => Loading.hide())
  })
}

const savePermissionRoles = ({ commit }, params) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.post(`${BASE_URL}/permissions/save-roles`, params)
      .then((res) => {
        resolve(res.data)
      })
      .catch(errs => reject(errs.response))
      .finally(() => Loading.hide())
  })
}

const rolePermissions = ({ commit }, params) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.get(`${BASE_URL}/roles/${params.id}/permissions`, { params })
      .then((res) => {
        resolve(res.data)
      })
      .catch(errs => reject(errs.response))
      .finally(() => Loading.hide())
  })
}

const addRole = ({ commit }, params) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  console.log('params', params)
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.post(`${BASE_URL}/roles`, params)
      .then(res => resolve(res.data))
      .catch(errs => reject(errs.response))
      .finally(() => Loading.hide())
  })
}

const updateRole = ({ commit }, params) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.put(`${BASE_URL}/roles/${params.id}`, params)
      .then(res => resolve(res.data))
      .catch(errs => reject(errs.response))
      .finally(() => Loading.hide())
  })
}

export {
  loadRoles,
  loadRole,
  optionsRoles,
  savePermissionRoles,
  rolePermissions,
  addRole,
  updateRole
}
