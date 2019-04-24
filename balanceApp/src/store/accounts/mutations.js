const LOAD_ACCOUNTS = (state, accounts) => {
  state.accounts = accounts
}

const LOAD_ACCOUNT = (state, account) => {
  state.account = account
}

export {
  LOAD_ACCOUNTS,
  LOAD_ACCOUNT
}
