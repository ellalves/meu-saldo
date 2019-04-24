
import Vue from 'vue'
import { Loading, QSpinnerGears } from 'quasar'

const BASE_URL = process.env.BASE_URL + '/auth'

const loadPermissions = ({
  commit
}, params) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.get(`${BASE_URL}/permissions`, { params })
      .then((res) => {
        commit('LOAD_PERMISSIONS', res.data)
        resolve(res.data)
      })
      .catch(errs => reject(errs.response))
      .finally(() => Loading.hide())
  })
}

const loadPermission = ({
  commit
}, params) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.get(`${BASE_URL}/permissions/${params.id}`, { params })
      .then((res) => {
        commit('LOAD_PERMISSION', res.data)
        resolve(res.data)
      })
      .catch(errs => reject(errs.response))
      .finally(() => Loading.hide())
  })
}

const optionsPermissions = ({ commit }, params) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.get(`${BASE_URL}/permissions/get-perms`, { params })
      .then((res) => {
        resolve(res.data)
      })
      .catch(errs => reject(errs.response))
      .finally(() => Loading.hide())
  })
}

const saveRolePermissions = ({
  commit
}, params) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.post(`${BASE_URL}/roles/save-permissions`, params)
      .then((res) => {
        resolve(res.data)
      })
      .catch(errs => reject(errs.response))
      .finally(() => Loading.hide())
  })
}

const permissionRoles = ({
  commit
}, params) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.get(`${BASE_URL}/permissions/${params.id}/roles`, { params })
      .then((res) => {
        resolve(res.data)
      })
      .catch(errs => reject(errs.response))
      .finally(() => Loading.hide())
  })
}

const addPermission = ({
  commit
}, params) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.post(`${BASE_URL}/permissions`, params)
      .then(res => resolve(res.data))
      .catch(errs => reject(errs.response))
      .finally(() => Loading.hide())
  })
}

const updatePermission = ({
  commit
}, params) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.put(`${BASE_URL}/permissions/${params.id}`, params)
      .then(res => resolve(res.data))
      .catch(errs => reject(errs.response))
      .finally(() => Loading.hide())
  })
}

export {
  optionsPermissions,
  saveRolePermissions,
  loadPermissions,
  loadPermission,
  permissionRoles,
  addPermission,
  updatePermission
}
