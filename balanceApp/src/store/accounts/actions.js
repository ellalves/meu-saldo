import Vue from 'vue'
import {
  Loading,
  QSpinnerGears
} from 'quasar'

const BASE_URL = process.env.BASE_URL + '/v1'

const loadAccounts = ({ commit }, params) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.get(`${BASE_URL}/accounts`, { params })
      .then((res) => {
        commit('LOAD_ACCOUNTS', res.data)
        resolve(res.data)
      })
      .catch((errs) => {
        reject(errs.response)
      })
      .finally(() => Loading.hide())
  })
}

const loadAccount = ({ commit }, params) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.get(`${BASE_URL}/accounts/${params.id}`, { params })
      .then((res) => {
        commit('LOAD_ACCOUNT', res.data)
        resolve(res.data)
      })
      .catch((errs) => {
        reject(errs.response)
      })
      .finally(() => Loading.hide())
  })
}

const createAccount = ({ commit }, params) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  params.condition = 'actived'
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.post(`${BASE_URL}/accounts`, params)
      .then((res) => {
        resolve(res.data)
      })
      .catch((errs) => {
        reject(errs.response)
      })
      .finally(() => Loading.hide())
  })
}

const updateAccount = ({ commit }, params) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  params.condition = 'actived'
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.put(`${BASE_URL}/accounts/${params.id}`, params)
      .then((res) => {
        resolve(res.data)
      })
      .catch((errs) => {
        reject(errs.response)
      })
      .finally(() => Loading.hide())
  })
}

const loadBanks = ({ commit }, params) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.get(`${BASE_URL}/banks`, { params })
      .then((res) => {
        resolve(res.data)
      })
      .catch((errs) => {
        reject(errs.response)
      })
      .finally(() => Loading.hide())
  })
}

export {
  loadAccounts,
  loadAccount,
  createAccount,
  updateAccount,
  loadBanks
}
