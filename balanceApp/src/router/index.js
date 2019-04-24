import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'
import { LocalStorage } from 'quasar'

Vue.use(VueRouter)
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function ({ store }) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  Router.beforeResolve((to, from, next) => {
    let allowedToEnter = true
    to.matched.some((record) => {
      let token = LocalStorage.getItem(process.env.NAME_TOKEN)
      let isLoggedIn = !!token
      let myRoles = LocalStorage.getItem('myRoles')
      let myPermissions = LocalStorage.getItem('myPermissions')
      if ('meta' in record) {
        if ('requiresAuth' in record.meta) {
          // debugger
          if (record.meta.requiresAuth) {
            if (!isLoggedIn) {
              allowedToEnter = false
              allowedToEnter = false
              next({
                path: '/login',
                replace: true,
                query: {
                  redirect: to.fullPath
                }
              })
            }
          }
        }

        if (allowedToEnter && 'permissions' in record.meta) {
          let canProceed = false
          let permissions = record.meta.permissions
          if (myRoles.indexOf('root') > -1) {
            canProceed = true
          } else {
            for (let index = 0; index < permissions.length; ++index) {
              let permission = permissions[index]
              if (myPermissions.indexOf(permission) > -1) {
                canProceed = true
              } else {
                console.error('Permissão não encontrada em Router.beforeEach:', permissions)
              }
            }
          }

          if (!canProceed) {
            allowedToEnter = false
            next({
              path: '/nao-autorizado',
              replace: true
            })
          }
        }
      }
    })

    if (allowedToEnter) {
      next()
    }
  })

  return Router
}
