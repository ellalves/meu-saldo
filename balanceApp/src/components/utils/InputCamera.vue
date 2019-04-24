<template>
    <q-uploader
      v-bind:value="value"
      ref="uploader"
      inverted color="red-8"
      :label="labelText"
      :multiple = 'allowMultiple'
      :url = "url"
      hide-upload-progress
      send-raw
      hide-upload-button
      class="col-3"
      @add="addFile"
      @remove:cancel="removeFile"
    />
</template>

<script>
// import { format } from 'quasar'

export default {
  name: 'input-camera',
  inheritAttrs: false,
  data () {
    return {
      url: '',
      listenerIndex: null
    }
  },

  props: {
    value: Boolean,
    allowMultiple: Boolean,
    labelText: String,
    id: String
  },

  methods: {
    addFile (file) {
      let resizedFile = null
      file = file[0]
      let that = this

      if (file.type.match(/image.*/)) {
        // Load the image
        let metaData = {}
        let reader = new FileReader()
        reader.onload = function (readerEvent) {
          let image = new Image()
          image.onload = function (imageEvent) {
            // Resize the image
            let canvas = document.createElement('canvas'),
              maxSize = 1024, // edit it, or get it from another param!
              width = image.width,
              height = image.height
            if (width > height) {
              if (width > maxSize) {
                height *= maxSize / width
                width = maxSize
              }
            } else {
              if (height > maxSize) {
                width *= maxSize / height
                height = maxSize
              }
            }
            canvas.width = width
            canvas.height = height
            canvas.getContext('2d').drawImage(image, 0, 0, width, height)
            let dataUrl = canvas.toDataURL('image/jpeg')
            let type = 'image/jpeg'

            // choose one of the above
            resizedFile = dataUrl

            let nextId = that.$refs.uploader._data.files.length
            nextId = nextId - 1

            // add image metadata
            metaData['lastModif ied'] = that.$refs.uploader._data.files[nextId].lastModified
            metaData['name'] = that.$refs.uploader._data.files[nextId].name
            metaData['size'] = that.$refs.uploader._data.files[nextId].size
            metaData['type'] = type

            // back to parent
            that.addNextListener()
            that.$emit('photo', resizedFile, that.id, metaData)
          }
          image.src = readerEvent.target.result
        }
        reader.readAsDataURL(file)
      }
    },

    removeFile (file) {
      let that = this
      let toFind = file.name
      let found = false
      let tempL = null

      for (let l = 0; l < this.$refs.uploader._data.files.length; l++) {
        if (this.$refs.uploader._data.files[l].name === toFind) {
          found = true
          tempL = l
          break
        }
      }
      if (found) {
        if (tempL != null) that.removeNextListener(tempL)
        this.$emit('removePhoto', toFind, this.id)
      }
    },

    updateUploaderImages: function (id, index, image) {
      // ToDo: below would work, but then we need other way to handle the original image
      // this.$refs.uploader._data.files[index]['__img'].src = image
    },

    addNextListener (nextListener) {
      let that = this
      if (nextListener == null) {
        nextListener = this.$refs.uploader._data.files.length - 1
        const childs = this.$refs.uploader.$el.children[1].children[0].children[nextListener].children[0]
        childs.id = 'image' + nextListener
        let selector = 'div#image' + nextListener
        this.listenerIndex = nextListener

        this.setListener(selector, 'click', that.openPopup, that.$refs.uploader.files[nextListener])
      } else {
        for (let l = 0; l < nextListener.length; l++) {
          let listenerIndex = nextListener[l]
          const childs = this.$refs.uploader.$el.children[1].children[0].children[listenerIndex].children[0]
          childs.id = 'image' + listenerIndex
          let selector = 'div#image' + listenerIndex
          this.listenerIndex = listenerIndex

          this.setListener(selector, 'click', that.openPopup, that.$refs.uploader.files[listenerIndex])
        }
      }
    },

    removeNextListener (index) {
      let that = this
      let nextListener = index
      let selector = 'div#image' + nextListener

      this.removeListener(selector, 'click', that.openPopup, that.$refs.uploader.files[nextListener])
    },

    openPopup (img) {
      let that = this
      img = img['__img'].src
      this.$emit('popup', img, that.listenerIndex, that.id)
    },

    setListener (selector, event, callback, props) {
      // let that = this
      let listenerElements = document.querySelectorAll(selector)
      if (listenerElements != null) {
        for (let le = 0; le < listenerElements.length; le++) {
          listenerElements[le].addEventListener(event, function (evt) {
            if (callback != null) callback(props)
          })
        }
      }
    },

    removeListener (selector, event, callback, props) {
      // let that = this
      let listenerElements = document.querySelectorAll(selector)
      if (listenerElements != null) {
        for (let le = 0; le < listenerElements.length; le++) {
          listenerElements[le].removeEventListener(event, function (evt) {
            if (callback != null) callback(props)
          })
        }
      }
    },

    setImage (photos, id) {
      let that = this
      // let index = id - 1
      let listenerIndexes = []

      for (let l = 0; l < photos.length; l++) {
        let length = that.$refs.uploader._data.files.length
        let img = new Image()
        // img.src = photos[l][id]
        img.src = photos[l][l + 1]
        let metadata = photos[l].metaData

        let imgObject = {}
        imgObject.lastModified = metadata.lastModified
        let DateTime = new Date(metadata.lastModified)
        imgObject.lastModifiedDate = DateTime
        imgObject.name = metadata.name
        imgObject.size = metadata.size
        imgObject.type = metadata.type
        imgObject.webkitRelativePath = ''
        imgObject.__doneUploading = false
        imgObject.__failed = false
        imgObject.__img = img
        imgObject.__progress = 0
        imgObject.__size = (metadata.size / 1024) + ' kB'
        imgObject.__timestamp = metadata.lastModified
        imgObject.__uploaded = false

        this.$refs.uploader._data.files[length] = imgObject
        this.$refs.uploader.totalSize = this.$refs.uploader.totalSize + imgObject.size
        this.$refs.uploader.queue.push(imgObject)
        this.$refs.uploader.expanded = true

        listenerIndexes.push(length)
      }
      setTimeout(function () {
        that.addNextListener(listenerIndexes)
      }, 50)
    }
  },

  computed: {
    inputListeners: function () {
      let vm = this
      // `Object.assign` merges objects together to form a new object
      return Object.assign({},
        // We add all the listeners from the parent
        this.$listeners,
        // Then we can add custom listeners or override the
        // behavior of some listeners.
        {
          // This ensures that the component works with v-model
          input: function (event) {
            vm.$emit('input', event)
            // if (!isNaN(event)) vm.$emit('input', event.toString().replace('.',''))
            // else return event.slice(0, -1)
          }
        }
      )
    }
  }
}
</script>
