<template>
  <q-page class="flex flex-center">
    Minhas Compras v.1.0
    Copyright 2019 - Webxpertise. Todos os direitos reservados
    <div>IMEI <br> {{IMEI}}</div>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      imageSrc: '',
      sourceType: 'CAMERA',
      IMEI: window.device === void 0 ? 'Espere ... localizando seu dispositivo mobile/tablet' : window.device
    }
  },

  methods: {
    captureImage (source) {
      this.pictureSourceType(source) // Define se a foto virá da camera ou da galeria
      navigator.camera.getPicture(
        data => { // on success
          this.imageSrc = `data:image/jpeg;base64, ${data}`
        },
        () => { // on fail
          this.$q.notify('Não foi possível acessar a câmera do dispositivo!')
        },
        { // camera options
          quality: 50,
          destinationType: navigator.camera.DestinationType.DATA_URL,
          encodingType: navigator.camera.EncodingType.JPEG,
          sourceType: this.sourceType,
          mediaType: navigator.camera.MediaType.PHOTOLIBRARY,
          cameraDirection: navigator.camera.Direction.BACK,
          correctOrientation: true,
          saveToPhotoAlbum: true,
          allowEdit: true,
          targetWidth: 300,
          targetHeight: 400
        }
      )
    },

    pictureSourceType (type) {
      if (type === 'CAMERA') {
        this.sourceType = navigator.camera.PictureSourceType.CAMERA
      } else if (type === 'PHOTOLIBRARY') {
        this.sourceType = navigator.camera.PictureSourceType.PHOTOLIBRARY
      }
    },

    clearImage () {
      this.imageSrc = ''
    }
  }
}
</script>
