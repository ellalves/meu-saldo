const LOAD_BALANCES = (state, balances) => {
  state.balances = balances
}

const LOAD_USER_BALANCE = (state, balance) => {
  state.balance = balance
}

export {
  LOAD_BALANCES,
  LOAD_USER_BALANCE
}
