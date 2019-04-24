import Vue from 'vue'
import { Loading, QSpinnerGears } from 'quasar'

const BASE_URL = process.env.BASE_URL + '/v1'

const loadHistorics = ({
  commit
}, params) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.get(`${BASE_URL}/historics`, { params })
      .then((res) => {
        commit('LOAD_HISTORICS', res.data)
        resolve(res.data)
      })
      .catch(errs => reject(errs.response))
      .finally(() => Loading.hide())
  })
}

const reports = ({
  commit
}, params) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.post(`${BASE_URL}/historics/reports`, params)
      .then((res) => {
        resolve(res.data)
      })
      .catch((errs) => reject(errs.response))
      .finally(() => Loading.hide())
  })
}

const loadHistoric = ({
  commit
}, params) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.get(`${BASE_URL}/historics/${params.id}`)
      .then((res) => {
        commit('LOAD_HISTORIC', res.data)
        resolve(res.data)
      })
      .catch((errs) => reject(errs.response))
      .finally(() => Loading.hide())
  })
}

const modifyStatus = ({
  commit
}, params) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  Vue.prototype.$axios.post(`${BASE_URL}/historic-modify-status`, params)
    .then(res => res.data)
    .finally(() => Loading.hide())
}

export {
  loadHistorics,
  reports,
  loadHistoric,
  modifyStatus
}
