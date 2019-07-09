// import something here
import PouchDB from 'pouchdb'
import RelationalPouch from 'relational-pouch'
import PouchDbFind from 'pouchdb-find'

PouchDB.plugin(RelationalPouch)
PouchDB.plugin(PouchDbFind)

const db = new PouchDB('db')
db.setSchema([
  { singular: 'author', plural: 'authors', relations: { books: { hasMany: 'book' } } },
  { singular: 'book', plural: 'books', relations: { author: { belongsTo: 'author' } } }
])

// "async" is optional
export default async ({ Vue }) => {
  var { authors } = await db.rel.find('author', 1)
  if (!authors || !authors.length) {
    await db.rel.save('author', { name: 'George R. R. Martin', id: 1, books: [6, 7] })
    await db.rel.save('book', { title: 'A Game of Thrones', id: 6, author: 1 })
    await db.rel.save('book', { title: 'The Hedge Knight', id: 7, author: 1 })
  }
  Vue.prototype.$db = db
}

export { db }
