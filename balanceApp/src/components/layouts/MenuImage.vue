<template>
<!--// Mudar foto //-->
<q-avatar size="72px">
  <img v-if="user.image" :src="['https://saldo.ellalves.net.br/storage/profiles/'] + user.image">
    <q-tooltip>
      Clique para alterar a imagem
    </q-tooltip>
</q-avatar>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      mPhoto: false
    }
  },

  methods: {
  }
}
</script>
