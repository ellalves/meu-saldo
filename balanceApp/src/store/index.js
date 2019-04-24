import Vue from 'vue'
import Vuex from 'vuex'

import auth from './auth'
import users from './users'
import roles from './roles'
import permissions from './permissions'
import balances from './balances'
import tickets from './tickets'
import accounts from './accounts'
import historics from './historics'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    namespaced: true,
    modules: {
      auth,
      users,
      roles,
      permissions,
      balances,
      tickets,
      accounts,
      historics
    }
  })
  return Store
}
