const LOAD_HISTORICS = (state, historics) => {
  state.historics = historics
}

const LOAD_HISTORIC = (state, historic) => {
  state.historic = historic
}

export {
  LOAD_HISTORICS,
  LOAD_HISTORIC
}
