<template>
  <q-page class="flex flex-center">
    <div class="q-pa-sm full-width">
      <q-table class="full-width q-mb-sm" title="Authors" :data="authors" :columns="columns.authors" row-key="id" />
      <q-table class="full-width" title="Books" :data="books" :columns="columns.books" row-key="id" />
    </div>
  </q-page>
</template>

<style>
</style>

<script>
export default {
  name: 'PageIndex',
  data () {
    let that = this
    return {
      authors: [],
      books: [],
      columns: {
        authors: [
          { name: 'name', label: 'Name', field: 'name', sortable: true },
          {
            name: 'books',
            label: 'Books',
            field: 'books',
            sortable: true,
            format (bookIds) {
              let books = bookIds.map(bookId => that.bookById[bookId].title)
              return books.join(', ')
            }
          }
        ],
        books: [
          { name: 'title', label: 'Title', field: 'title', sortable: true },
          {
            name: 'author',
            label: 'Author',
            field: 'author',
            sortable: true,
            format (authorId) {
              return that.authorById[authorId].name
            }
          }
        ]
      }
    }
  },
  async mounted () {
    let { authors, books } = await this.$db.rel.find('authors')
    this.authors = authors
    this.books = books
  },
  computed: {
    authorById () {
      return this.authors.reduce((authors, author) => {
        authors[author.id] = author
        return authors
      }, {})
    },
    bookById () {
      return this.books.reduce((books, book) => {
        books[book.id] = book
        return books
      }, {})
    }
  }
}
</script>
