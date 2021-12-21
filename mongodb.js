const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log(`Please provide the password as an argument: node mongo.js ${password}`)
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://gelu:${password}@cluster0.ubq0q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
  name: String,
  number: Number,
  date: Date,
  important: Boolean,
  id: String
})

const Person = mongoose.model('Note', personSchema)

const person = new Person({
  name: person.name,
  number: person.number,
  date: new Date().toISOString(),
  important: person.important || false,
  id: generateId()
})

person.save().then(result => {
  console.log('person saved!')
  mongoose.connection.close()
})