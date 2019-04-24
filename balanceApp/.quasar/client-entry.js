/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking on adding startup/initialization code.
 * Use "quasar new boot <name>" and add it there.
 * One boot file per concern. Then reference the file(s) in quasar.conf.js > boot:
 * boot: ['file', ...] // do not add ".js" extension to it.
 *
 * Boot files are your "main.js"
 **/

import 'quasar/dist/quasar.ie.polyfills.js'



import '@quasar/extras/roboto-font/roboto-font.css'

import '@quasar/extras/material-icons/material-icons.css'




import 'quasar-styl'


import 'src/css/app.styl'


import Vue from 'vue'
import createApp from './app.js'




import b_Booti18n from 'boot/i18n'

import b_Bootaxios from 'boot/axios'

import b_Bootvuelidate from 'boot/vuelidate'

import b_BootrolesPermissions from 'boot/rolesPermissions'

import b_Bootcroppa from 'boot/croppa'









Vue.config.devtools = true
Vue.config.productionTip = false



console.info('[Quasar] Running SPA.')



const { app, store, router } = createApp()



async function start () {
  
  const bootFiles = [b_Booti18n,b_Bootaxios,b_Bootvuelidate,b_BootrolesPermissions,b_Bootcroppa]
  for (let i = 0; i < bootFiles.length; i++) {
    try {
      await bootFiles[i]({
        app,
        router,
        store,
        Vue,
        ssrContext: null
      })
    }
    catch (err) {
      if (err && err.url) {
        window.location.href = err.url
        return
      }

      console.error('[Quasar] boot error:', err)
      return
    }
  }
  

  

    

    

      new Vue(app)

    

  

}

start()
