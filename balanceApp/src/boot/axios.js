import axios from 'axios'

export default ({ Vue }) => {
  Vue.prototype.$axios = axios
}

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

let tokenAccess = localStorage.getItem(process.env.NAME_TOKEN) || sessionStorage.getItem(process.env.NAME_TOKEN)
if (tokenAccess) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${tokenAccess}`
}
