<template>
<div>
  <button :class="['btn btn-danger', classItem]" @click.prevent="confirmDelete(item)">
      Deletar
    </button>
</div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    },

    title: {
      type: String | Number,
      required: true
    },
    classItem: {
      type: String,
      required: false,
      default: ''
    }
  },

  methods: {
    confirmDelete(item) {
      this.$snotify.error(`Deseja deletar: ${this.title} ?`, 'Confirme!', {
        timeout: 10000,
        showProgressBar: true,
        pauseOnHover: true,
        buttons: [{
            text: 'Não',
            action: (toast) => {this.$snotify.remove(toast.id)},
            bold: true
          },
          {
            text: 'Sim',
            action: (toast) => {this.$emit('destroy', item.id); this.$snotify.remove(toast.id)},
            bold: true
          },
        ]
      })
    },
  }
}
</script>
