export const mixin = {
  methods: {
    wordWrapToStringList (text, maxLength = 10) {
      let result = [],
        line = []
      let length = 0
      text.split(' ').forEach(function (word) {
        if ((length + word.length) >= maxLength) {
          result.push(line.join(' '))
          line = []
          length = 0
        }
        length += word.length + 1
        line.push(word)
      })
      if (line.length > 0) {
        result.push(line.join(' '))
      }
      return result
    },

    formatPrice (value, cif = '') {
      let val = (value / 1).toFixed(2).replace('.', ',')
      return cif + ' ' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },

    formatSex (sex, format = false) {
      let arr = []
      arr['male'] = 'Masculino'
      arr['female'] = 'Feminino'
      arr['other'] = 'Outro'
      if (!sex) {
        return arr
      }
      let status = ''
      let label = ''
      switch (sex) {
        case 'male':
          status = arr['male']
          label = 'primary'
          break
        case 'female':
          status = arr['female']
          label = 'secondary'
          break
        case 'other':
          status = arr['other']
          label = 'warning'
          break
      }

      if (format) {
        return `<q-badge square color='${label}'>${status}</q-badge>`
      } else {
        return status
      }
    },

    status (cond, format = false) {
      let arr = []
      arr['actived'] = 'Ativo'
      arr['inactived'] = 'Inativo'
      arr['pending'] = 'Pendente'
      arr['deleted'] = 'Deletado'
      if (!cond) {
        return arr
      }
      let status = ''
      let label = ''
      switch (cond) {
        case 'actived':
          status = arr['actived']
          label = 'primary'
          break
        case 'inactived':
          status = arr['inactived']
          label = 'secondary'
          break
        case 'pending':
          status = arr['pending']
          label = 'warning'
          break
        case 'deleted':
          status = arr['deleted']
          label = 'danger'
          break
      }

      if (format) {
        return `<q-badge square color='${label}'>${status}</q-badge>`
      } else {
        return status
      }
    }
  }
}
