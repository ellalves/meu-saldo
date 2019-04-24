import Vue from 'vue'
import {
  LocalStorage,
  Loading,
  QSpinnerGears
} from 'quasar'

const CONFIGS = {
  headers: {
    'content-type': 'multipart/form-data'
  }
}

const registerUser = ({
  commit
}, formData) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.post(`${process.env.BASE_URL}/auth/register`, formData)
      .then(res => resolve(res.data))
      .catch(errors => reject(errors))
      .finally(() => Loading.hide())
  })
}

// function setLocalStorage ({
//   commit
// }, data) {
//   LocalStorage.set('me', data.me)
//   LocalStorage.set('myPermissions', data.permissions.map((obj) => obj.name))
//   LocalStorage.set('MyRoles', data.roles.map((obj) => obj.name))
// }

const login = ({ commit }, params) => {
  return new Promise((resolve, reject) => {
    Loading.show({
      spinner: QSpinnerGears,
      message: 'Aguarde ...',
      spinnerSize: 50 // in pixels
    })
    Vue.prototype.$axios.post(`${process.env.BASE_URL}/auth/login`, params)
      .then((response) => {
        const token = response.data.access_token // atribui o valor do token a uma variavel
        commit('LOGIN_USER', response.data) // Muda o estado
        commit('SET_TOKEN', token) // Muda o estado
        LocalStorage.set('myRoles', response.data.roles.map((obj) => obj.name))
        LocalStorage.set('me', response.data.user)
        LocalStorage.set('myPermissions', response.data.permissions.map((obj) => obj.name))
        localStorage.setItem(`${process.env.NAME_TOKEN}`, token) // coloca no localStorage
        Vue.prototype.$axios.defaults.headers.common['Authorization'] = `Bearer ${token}` // coloca no cabeçalho
        resolve(response.data)
      })
      .catch(errors => reject(errors))
      .finally(() => Loading.hide())
  })
}

const logout = ({ commit }) => {
  commit('LOGOUT_USER')
  localStorage.removeItem(process.env.NAME_TOKEN)
  LocalStorage.remove('me')
  LocalStorage.remove('myRoles')
  LocalStorage.remove('myPermissions')
}

const checkLogin = ({ commit }) => {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem(process.env.NAME_TOKEN)
    if (!token) {
      commit('LOGOUT_USER')
      return false
    }

    // Loading.show({ message: 'Aguarde ...' })
    Vue.prototype.$axios.post(`${process.env.BASE_URL}/auth/me`)
      .then((response) => {
        commit('SET_TOKEN', token)
        commit('LOGIN_USER', response.data)
        resolve(response.data)
      })
      .catch((errors) => {
        Loading.hide()
        commit('LOGOUT_USER')
        reject(errors.response)
      })
      // .finally(() => Loading.hide())
  })
}

const forgotPassword = ({
  commit
}, params) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.post(`${process.env.BASE_URL}/auth/forgot-password`, params)
      .then((res) => resolve(res.data))
      .catch(errors => reject(errors.response))
      .finally(() => Loading.hide())
  })
}

const updateUser = ({
  commit
}, params) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.put(`${process.env.BASE_URL}/auth/update`, params)
      .then((res) => {
        commit('LOGIN_USER', res.data)
        resolve(res.data)
      })
      .catch(errors => reject(errors))
      .finally(() => Loading.hide())
  })
}

const resetPassword = ({
  commit
}, params) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.post(`${process.env.BASE_URL}/auth/password/reset`, params)
      .then(res => resolve(res.data))
      .catch(errors => reject(errors.response))
      .finally(() => Loading.hide())
  })
}

const changePassword = ({
  commit
}, params) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.patch(`${process.env.BASE_URL}/auth/change-password`, params)
      .then((res) => {
        // commit('LOGIN_USER', res.data)
        resolve(res.data)
      })
      .catch(errors => reject(errors.response))
      .finally(() => Loading.hide())
  })
}

const changeImage = ({
  commit
}, formData) => {
  Loading.show({
    spinner: QSpinnerGears,
    message: 'Aguarde ...',
    spinnerSize: 50 // in pixels
  })
  formData.append('_method', 'PATCH')
  return new Promise((resolve, reject) => {
    Vue.prototype.$axios.post(`${process.env.BASE_URL}/auth/change-image`, formData, CONFIGS)
      .then((res) => {
        // commit('LOGIN_USER', res.data)
        resolve(res.data)
      })
      .catch(errors => reject(errors.response))
      .finally(() => Loading.hide())
  })
}

export {
  registerUser,
  login,
  logout,
  checkLogin,
  updateUser,
  forgotPassword,
  resetPassword,
  changePassword,
  changeImage
}
