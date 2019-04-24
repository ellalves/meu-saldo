const LOGIN_USER = (state, data) => {
  state.me = data.user
  state.myRoles = data.roles.map((obj) => obj.name)
  state.myPermissions = data.permissions.map((obj) => obj.name)
}

const SET_TOKEN = (state, token) => {
  state.token = token
}

const LOGOUT_USER = (state) => {
  state.me = {}
  state.token = null
  state.urlBack = 'login'
}

const CHANGE_URL_BACK = (state, url) => {
  state.urlBack = url
}

export {
  LOGIN_USER,
  SET_TOKEN,
  LOGOUT_USER,
  CHANGE_URL_BACK
}
