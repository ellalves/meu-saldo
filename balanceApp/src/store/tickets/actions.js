import Vue from 'vue'
import {
  Loading,
  QSpinnerGears
} from 'quasar'

const BASE_URL = process.env.BASE_URL

const loadTickets = ({ commit }, params) => {
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.get(`${BASE_URL}/v1/billets`, { params })
      .then((res) => {
        commit('LOAD_TICKETS', res.data)
        resolve(res.data)
      })
      .catch(err => reject(err.response))
  })
}

const ticket = ({ commit }, data) => {
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

const payTicket = ({ commit }, params) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.post(`${BASE_URL}/v1/pay-billet`, params)
      .then((res) => resolve(res.data))
      .catch(err => reject(err.response))
      .finally(() => Loading.hide())
  })
}

const destroyTicket = ({ commit }, params) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.delete(`${BASE_URL}/v1/billets/${params.id}`)
      .then(res => resolve(res.data))
      .catch(err => reject(err.response))
      .finally(() => Loading.hide())
  })
}

export {
  ticket,
  loadTickets,
  payTicket,
  destroyTicket
}
