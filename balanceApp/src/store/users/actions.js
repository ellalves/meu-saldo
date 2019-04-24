import Vue from 'vue'
import {
  Loading,
  QSpinnerGears
} from 'quasar'

const BASE_URL = process.env.BASE_URL

const loadUsers = ({
  commit
}, params) => {
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.get(`${BASE_URL}/auth/users`, { params })
      .then((res) => {
        commit('LOAD_USERS', res.data)
        resolve(res.data)
      })
      .catch((errors) => {
        reject(errors)
      })
  })
}

const changeStatus = ({
  commit
}, params) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.patch(`${BASE_URL}/auth/change-status`, params)
      .then((res) => {
        resolve(res.data)
      })
      .catch(errors => reject(errors.response))
      .finally(() => commit('PRELOADER', false))
  })
}

export {
  loadUsers,
  changeStatus
}
