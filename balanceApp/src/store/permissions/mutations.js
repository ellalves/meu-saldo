const LOAD_PERMISSIONS = (state, permissions) => {
  state.permissions = permissions
}

const LOAD_PERMISSION = (state, permission) => {
  state.permission = permission
}

export {
  LOAD_PERMISSIONS,
  LOAD_PERMISSION
}
