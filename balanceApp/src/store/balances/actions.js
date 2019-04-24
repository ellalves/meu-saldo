import Vue from 'vue'
import { Loading, QSpinnerGears } from 'quasar'

const BASE_URL = process.env.BASE_URL

const loadBalances = ({ commit }, params) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  Vue.prototype.$axios.get(`${BASE_URL}/v1/balances`, { params })
    .then(res => commit('LOAD_BALANCES', res.data))
    .catch(errors => errors)
    .finally(() => Loading.hide())
}

const loadUserBalance = ({ commit }, params) => {
  // Loading.show({
  //   spinner: QSpinnerGears,
  //   message: 'Aguarde ...',
  //   spinnerSize: 50 // in pixels
  // })
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.get(`${BASE_URL}/v1/balances`, { params })
      .then((res) => {
        commit('LOAD_USER_BALANCE', res.data)
        resolve()
      })
      .catch(errors => reject(errors.response))
      // .finally(() => Loading.hide())
  })
}

const billet = ({ commit }, data) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.post(`${BASE_URL}/v1/generate-billet`, data)
      .then((res) => {
        resolve(res.data)
      })
      .catch(errors => reject(errors.response))
      .finally(() => Loading.hide())
  })
}

const deposit = ({ commit }, deposit) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.post(`${BASE_URL}/v1/deposit`, deposit)
      .then((res) => {
        resolve(res.data)
      })
      .catch(errors => reject(errors.response))
      .finally(() => Loading.hide())
  })
}

const confirmTransference = ({ commit }, sender) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.post(`${BASE_URL}/v1/confirm-transference`, { sender })
      .then(res => resolve(res.data))
      .catch(errors => reject(errors.response))
      .finally(() => Loading.hide())
  })
}

const saveTransference = ({ commit }, transference) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.post(`${BASE_URL}/v1/transference`, transference)
      .then(res => resolve(res.data))
      .catch(errors => reject(errors.response))
      .finally(() => Loading.hide())
  })
}

const saveWithdraw = ({ commit }, withdraw) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.post(`${BASE_URL}/v1/withdraw`, withdraw)
      .then(res => resolve(res.data))
      .catch(errors => reject(errors.response))
      .finally(() => Loading.hide())
  })
}

export {
  loadBalances,
  loadUserBalance,
  billet,
  deposit,
  saveWithdraw,
  saveTransference,
  confirmTransference
}
