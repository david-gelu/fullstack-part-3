require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
app.use(express.json())
app.use(cors())

const mongoose = require('mongoose')
const Person = require('./models/person.js')

// const requestLogger = (request, response, next) => {
//   const bodyStr = JSON.stringify(request.body)
//   const requestData = `${request.method} ${request.path} ${response.statusCode} - ${process.uptime()} ms ${bodyStr}`
//   console.log(requestData)
//   next()
// }
// app.use(requestLogger)


let persons = []

app.use(express.static('build'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'name is missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    date: new Date().toISOString(),
    important: body.important || false,
    id: body.id
  })

  person.save().then(savePerson => {
    response.json(savePerson)
    mongoose.connection.close()
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.find(request.body.id).then(person => {
    response.json(person)
    mongoose.connection.close()
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const body = request.params
  Person.findByIdAndRemove(body.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => console.log(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


app.get('/api/info', (request, response) => {
  response.send(`
  <h2>Phonebook has info for ${persons.length} people</h2>
  <h3>${new Date()}<h3>
  `)
})

const PORT = process.env.PORT | 5000
app.listen(PORT)
console.log(`Server running on port ${PORT}`)