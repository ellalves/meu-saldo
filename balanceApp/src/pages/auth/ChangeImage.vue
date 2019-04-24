<template>
  <q-page class="q-my-xl row q-gutter-xs justify-center">
    <q-card class="col-md-5 col-sm-5 col-xs-10 text-center">
      <q-card-section>
        <div class="text-h6">Alterar imagem</div>
        <div class="text-subtitle2">Preencha o formulário para alterar a imagem de perfil</div>
      </q-card-section>

        <croppa v-model="myCroppa" canvas-color="transparent" class="text-center cursor-pointer"
          :initial-image="link+image"
          :width="300"
          :height="400"
          :quality="1"
          prevent-white-space
          :placeholder="placeholder"
          :placeholder-font-size="14"
          :show-loading="true"
          accept=".jpg, .png, .jpeg"
          :file-size-limit="204800"
          @file-type-mismatch="onFileTypeMismatch"
          @file-size-exceed="onFileSizeExceed"
          @new-image="generateImage"
        >
          <div class="spinner" v-if="myCroppa && myCroppa.loading"></div> <!-- custom spinner inserted as a slot -->
        </croppa>

      <q-card-actions align="around" v-if="imgUrl || image">
        <q-btn  icon="image_search" color="primary" v-if="myCroppa" @click.native="generateImage">
          <q-tooltip>
            Visualizar imagem
          </q-tooltip>
       </q-btn>
        <q-btn icon="cloud_upload" color="positive" v-if="imgUrl" @click.native="upload">
          <q-tooltip>
             Salvar imagem
          </q-tooltip>
        </q-btn>
        <q-btn icon="rotate_90_degrees_ccw" @click.native="rotate">
          <q-tooltip>
            Rotacionar a imagem 90º
          </q-tooltip>
        </q-btn>
        <q-btn icon="swap_horiz" @click.native="flipX">
          <q-tooltip>
            Inverter horizontalmente
          </q-tooltip>
        </q-btn>
        <q-btn icon="swap_vert" @click.native="flipY">
          <q-tooltip>
            Inverter verticalmente
          </q-tooltip>
        </q-btn>
        <q-btn icon="zoom_in" @click.native="zoomIn">
          <q-tooltip>
            Diminuir zoom
          </q-tooltip>
        </q-btn>
        <q-btn icon="zoom_out" @click.native="zoomOut">
          <q-tooltip>
            Aumentar zoom
          </q-tooltip>
        </q-btn>
      </q-card-actions>
    </q-card>

    <q-card class="col-md-5 col-sm-5 col-xs-10">
      <q-card-section>
        <div class="text-h6">Pré visualização da imagem</div>
        <div class="text-subtitle2">Aqui você pode ver como a imagem ficará!</div>
        <div class="size">Tamanho da imagem: {{imgUrl.length / 1000}} Kb</div>
          <q-img class="q-mx-auto"
            :src="imgUrl ? imgUrl : link+image"
          >
            <div class="absolute-bottom text-subtitle1 text-center q-pa-xs">
            Visualização {{imgUrl.lenght}}
          </div>
        </q-img>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'ChangeImage',
  data () {
    return {
      myCroppa: null,
      imgUrl: '',
      removeImg: false,
      image: null,
      link: 'https://saldo.ellalves.net.br/storage/profiles/'
    }
  },

  created () {
    this.image = this.me.image
  },

  montado () {
    document.addEventListener('deviceready', this.onDeviceReady, false)
  },

  computed: {
    ...mapState('auth', ['me']),
    placeholder () {
      return this.myCroppa && this.myCroppa.loading ? '' : 'Escolha uma imagem de perfil!'
    }
  },

  methods: {
    onFileTypeMismatch (file) {
      alert('Tipo de arquivo inválido. Por favor, escolha um arquivo jpeg ou png.')
    },

    onFileSizeExceed (file) {
      alert('Tamanho do arquivo excedido. Por favor, escolha um arquivo menor que 200kb.')
    },

    rotate () {
      this.myCroppa.rotate()
    },

    flipX () {
      this.myCroppa.flipX()
    },

    flipY () {
      this.myCroppa.flipY()
    },

    zoomIn () {
      this.myCroppa.zoomIn()
    },

    zoomOut () {
      this.myCroppa.zoomOut()
    },

    generateImage: function () {
      let url = this.myCroppa.generateDataUrl()
      if (!url) {
        alert('no image')
        return false
      }
      this.imgUrl = url
    },

    ...mapActions('auth', ['changeImage']),
    upload () {
      if (!this.myCroppa.hasImage()) {
        alert('no image to upload')
        return false
      }

      this.myCroppa.generateBlob((blob) => {
        var fd = new FormData()
        fd.append('image', blob, this.me.document + '.png')
        fd.append('id', this.me.id)
        this.changeImage(fd).then((res) => {
          this.$q.notify({
            message: res.message,
            color: 'green-10',
            position: 'center',
            icon: 'done_outline',
            timeout: Math.random() * 5000 + 3000
          })
        })
      })
    }
  }
}
</script>

<style>
</style>
