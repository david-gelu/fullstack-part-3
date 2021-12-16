const express = require('express')
const app = express()

const cors = require('cors')
app.use(express.json())
app.use(cors())

const requestLogger = (request, response, next) => {
  const bodyStr = JSON.stringify(request.body)
  const requestData = `${request.method} ${request.path} ${response.statusCode} - ${process.uptime()} ms ${bodyStr}`
  console.log(requestData)
  next()
}
app.use(requestLogger)

let persons = [
  {
    "name": "Arto Hellas",
    "number": "3345667",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]
const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

app.use(express.static('build'))

// app.get('/', (request, response) => {
//   response.send('<h1>Hello World!</h1>')
// })

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})


app.post('/api/persons', (request, response) => {
  const person = request.body
  if (!person.name || !person.number) {
    return response.status(400).json({
      error: `${person.name ? 'name' : 'number'} is missing`
    })
  }
  const nameAlredyExists = persons.find(newName => newName.name === person.name)
  if (nameAlredyExists) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const addPerson = {
    name: person.name,
    number: person.number,
    date: new Date().toISOString(),
    important: person.important || false,
    id: generateId()
  }


  persons = persons.concat(addPerson)
  response.json(person)
})

app.get('/api/info', (request, response) => {
  response.send(`
  <h2>Phonebook has info for ${persons.length} people</h2>
  <h3>${new Date()}<h3>
  `)
})

const PORT = process.env.PORT | 5000
app.listen(PORT)
console.log(`Server running on port ${PORT}`)