import { mapState } from 'vuex'

export default ({ Vue }) => {
  Vue.mixin({
    // Qualquer coisa adicionada a um mixin será injetada em todos os componentes.]
    computed: {
      ...mapState('auth', ['myPermissions']),
      ...mapState('auth', ['myRoles'])
    },

    methods: {
      can (perm) {
        // if (this.myPermissions.hasOwnProperty() || this.myRoles.hasOwnProperty()) { // Verifica se existe o objeto
        if (this.myPermissions.indexOf(perm) > -1 || this.myRoles.indexOf('root') > -1) {
          // console.log('Executou boot', $perm)
          return true
        }
        // } else {
        // return false
        // }
      }
    }
  })
}
