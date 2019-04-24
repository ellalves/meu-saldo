// Configuration for your app

module.exports = function (ctx) {
  return {
    // app plugins (/src/boot)
    boot: [
      'i18n',
      'axios',
      'vuelidate',
      'rolesPermissions',
      'croppa'
    ],
    css: [
      'app.styl'
    ],
    extras: [
      'roboto-font',
      'material-icons' // optional, you are not bound to it
      // 'ionicons-v4',
      // 'mdi-v3',
      // 'fontawesome-v5'
    ],
    supportIE: true,
    build: {
      env: ctx.dev ? { // Variáveis
        BASE_URL: JSON.stringify('https://saldo.ellalves.net.br/api'),
        NAME_TOKEN: JSON.stringify('TOKEN_AUTH')
      } : {
        BASE_URL: JSON.stringify('https://saldo.ellalves.net.br/api'),
        NAME_TOKEN: JSON.stringify('TOKEN_AUTH')
      },
      scopeHoisting: true,
      vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/
        })
      }
    },
    devServer: {
      https: true,
      // port: 8080,
      open: true // opens browser window automatically
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      components: [
        'QLayout',
        'QHeader',
        'QDrawer',
        'QFooter',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QBtnGroup',
        'QBtnDropdown',
        'QToggle',
        'QIcon',
        'QAvatar',
        'QSeparator',
        'QSpace',
        'QList',
        'QItem',
        'QItemSection',
        'QItemLabel',
        'QMenu',
        'QInput',
        'QSelect',
        'QRadio',
        'QUploader',
        'QCard',
        'QCardSection',
        'QCardActions',
        'QDialog',
        'QEditor',
        'QTooltip',
        'QTabs',
        'QTab',
        'QBadge',
        'QRouteTab',
        'QParallax',
        'QImg',
        'QTree',
        'QTable',
        'QTh',
        'QTr',
        'QTd',
        'QBanner',
        'QCheckbox',
        'QOptionGroup',
        'QBar',
        'QPopupEdit'
      ],
      directives: [
        'Ripple',
        'CloseDialog',
        'CloseMenu',
        'ClosePopup'
      ],
      // Quasar plugins
      plugins: [
        'Notify',
        'Loading',
        'LocalStorage',
        'SessionStorage'
      ]
      // iconSet: 'material-icons'
      // lang: 'de' // Quasar language
    },
    // animations: 'all' --- includes all animations
    animations: [],
    ssr: {
      pwa: false
    },
    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {},
      manifest: {
        name: 'Quasar App',
        short_name: 'Quasar-PWA',
        description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/my_icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/my_icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/my_icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/my_icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/my_icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },
    cordova: {
      id: 'br.net.ellalves.saldo.app',
      version: '0.0.1-beta'
    },
    electron: {
      // bundler: 'builder', // or 'packager'
      extendWebpack (cfg) {
        // do something with Electron process Webpack cfg
      },
      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      },
      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'quasar-app'
      }
    }
  }
}
