const isLogged = (state) => {
  return !!state.token
}

const token = (state) => {
  return state.token
}

export {
  isLogged,
  token
}
