<template>
  <q-page>
    <q-toolbar class="bg-secondary text-white shadow-2">
      <q-toolbar-title>
        <q-btn flat icon="keyboard_arrow_left" v-go-back.single />
        Lista de marcas
      </q-toolbar-title>
      <q-btn flat left dense label="Novo" icon="add_circle_outline" class="cursor-pointer" @click.native="dialogSave('create', null)" />
    </q-toolbar>
    <q-list bordered separator>
      <q-item clickable v-ripple v-for="mark in marks" :key="mark.id">
        <q-item-section top avatar>
          <q-avatar rounded>
            <q-img :src="mark.image !== null ? mark.image : './statics/mc-up-transparent.png'" :alt="mark.image" placeholder-src="./statics/mc-up-transparent.png" />
          </q-avatar>
        </q-item-section>

        <q-item-section @click.native="dialogSave('update', mark)">
          <q-item-label>{{mark.name}}</q-item-label>
          <q-item-label caption>#ID: {{mark.id}}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <q-btn
      @click.native="setPaginate(perPage)"
      color="secondary"
      label="Mais produtos ..."
      v-if="showMore" class="full-width"
      :loading="loadPage"
    />

    <!--// Save //-->
    <q-dialog v-model="mSave">
      <q-card style="width: 700px max-width: 80vw">
        <q-card-section class="row items-center">
          <div class="text-h6"> {{titleMark}} </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <take-picture :srcImage="mark.image" @takeImage="returnImg"></take-picture>
          <q-form>
            <q-input
              v-model="mark.name"
              label="Nome da marca"
            />
            <q-btn icon="save" color="positive" label="Salvar" @click.native="saveProduct()" :class="[{'full-width': this.$q.platform.is.mobile}, 'q-mt-md']" />
            <q-btn icon="delete_forever" color="negative" label="Deletar" v-close-popup @click.native="mDelete = true" :class="[{'full-width': this.$q.platform.is.mobile}, 'q-mt-md']" v-if="this.type == 'update'" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!--// Delete confirm //-->
    <q-dialog v-model="mDelete" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">Deletar registro: {{this.mark.name}}</div>
        </q-card-section>
        <q-card-section class="row items-center">
          <q-avatar icon="delete_outline" color="negative" text-color="white" />
          <span class="q-ml-sm">Essa ação não pode ser desfeita!</span>
        </q-card-section>

        <q-card-actions class="float-right">
          <q-btn flat label="Não" color="info" v-close-popup />
          <q-btn flat label="Sim" color="negative" @click.native="deletarProduct" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions } from 'vuex'
import { price } from '../../components/mixins/price'
import TakePicture from '../../components/global/TakePicture'

export default {
  name: 'listMarks',

  created () {
    this.setPaginate(this.perPage)
  },

  data () {
    return {
      titleMark: 'Adicionar marca',
      sourceType: 'CAMERA',
      type: 'add',
      mSave: false,
      mDelete: false,
      mark: {
        id: null,
        name: '',
        image: null,
        mark_id: 1,
        user_id: 1
      },
      marks: {},
      limit: 5,
      showMore: true,
      totalPage: 1,
      perPage: 10,
      loadPage: false
    }
  },

  methods: {
    setPaginate (more) {
      this.limit += more
      this.listMarks(this.limit)
    },
    ...mapActions('marks', ['createDB', 'read', 'readOne', 'create', 'update', 'destroy']),
    dialogSave (type, mark) {
      this.mSave = true
      this.type = type
      this.mark = {}
      if (type === 'update') {
        this.titleMark = 'Alterar marca'
        // alert('prodList: ' + JSON.stringify(mark))
        this.readOne(mark).then((res) => {
          this.mark = res.item(0)
        }).catch(() => {
          this.$q.notify({
            message: 'Oooops! Ocorreu um erro inesperado.',
            color: 'red-10',
            position: 'center',
            icon: 'error_outline',
            timeout: Math.random() * 5000 + 3000
          })
        })
      }
    },

    saveProduct () {
      this.mark.user_id = 1
      if (this.type === 'update') {
        this.update(this.mark).then(() => {
          this.$q.notify({
            message: 'Produto atualizado com sucesso!',
            color: 'green-10',
            position: 'center',
            icon: 'done_outline',
            timeout: Math.random() * 1500
          })
        }).catch(() => {
          this.$q.notify({
            message: 'Oooops! Ocorreu um erro inesperado.',
            color: 'red-10',
            position: 'center',
            icon: 'error_outline',
            timeout: Math.random() * 5000 + 3000
          })
        })
      } else {
        this.create(this.mark).then(() => {
          this.$q.notify({
            message: 'Produto adicionado com sucesso!',
            color: 'green-10',
            position: 'center',
            icon: 'done_outline',
            timeout: Math.random() * 1500
          })
        }).catch((err) => {
          this.$q.notify({
            message: 'Oooops! Ocorreu um erro inesperado.' + JSON.stringify(err.message),
            color: 'red-10',
            position: 'center',
            icon: 'error_outline',
            timeout: Math.random() * 5000 + 1000
          })
        })
      }
      this.listMarks(this.limit + 1)
      this.mSave = false
    },

    deletarProduct () {
      this.destroy(this.mark).then(() => {
        this.$q.notify({
          message: 'Produto deletado com sucesso!',
          color: 'green-10',
          position: 'center',
          icon: 'done_outline',
          timeout: Math.random() * 1500
        })
        this.listMarks(this.limit + 1)
      }).catch(() => {
        this.$q.notify({
          message: 'Oooops! Ocorreu um erro inesperado.',
          color: 'red-10',
          position: 'center',
          icon: 'error_outline',
          timeout: Math.random() * 5000 + 1000
        })
      })
    },

    listMarks (limit) {
      this.loadPage = true
      this.read({ limit: [limit] }).then((results) => {
        var len = results.rows.length
        this.limit = len
        this.marks = []
        for (var i = 0; i < len; i++) {
          this.marks.push(results.rows.item(i))
        }
      })
      this.read({}).then((results) => {
        this.totalPage = results.rows.length
        if (this.totalPage <= this.limit) {
          this.showMore = false
        }
        this.loadPage = false
      })
    },

    returnImg (img) {
      // Recebe os dados que foram retornado pelo $emit
      this.mark.image = img
    }
  },

  components: {
    TakePicture
  },

  mixins: [price]
}
</script>

<style>
</style>
