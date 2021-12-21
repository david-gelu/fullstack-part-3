const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log(`Please provide the password as an argument: node mongo.js ${password}`)
  process.exit(1)
}

const password = process.argv[2]
const firstName = process.argv[3]
const lastName = process.argv[4]
const phone = process.argv[5]
console.log(process)
const url =
  `mongodb+srv://gelu:${password}@myfirstcluster.ja4gd.mongodb.net/MyFirstCluster?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  date: Date,
  important: Boolean,
  id: Number
})

const Person = mongoose.model('Person', personSchema)
const person = new Person({
  name: `${firstName} ${lastName}`,
  number: phone,
  date: new Date().toISOString(),
  important: false,
})

if (firstName && lastName && phone) {
  person.save().then(result => {
    console.log(`Added ${firstName} number ${phone} to phonebook `)
    mongoose.connection.close()
  })
}

Person.find({}).then(result => {
  console.log('phonebook:')
  result.map(person => {
    console.log(`${person.name} ${person.number}`)
  })
  mongoose.connection.close()
})