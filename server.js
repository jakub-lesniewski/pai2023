// embedded modules
const fs = require('fs')

// external modules
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')

// own modules
const person = require('./person')

let config = {}
try {
    config = JSON.parse(fs.readFileSync('config.json'))
} catch(err) {
    console.error('Configuration broken:', err.message)
    process.exit(0)
}

const app = express()

app.use(morgan('tiny'))
app.use(cors())

app.use(bodyParser.json())
app.use((err, req, res, next) => {
    res.status(400).json({ error: err.message })
})

app.use(express.static(config.frontend))

// data endpoints
app.get('/person', person.get)
app.post('/person', person.post)
app.put('/person', person.put)
app.delete('/delete', person.delete)

mongoose.connect(config.dbUrl).then(() => {
    app.listen(config.port, () => {
        console.log('Backend listening on port', config.port)
    })
}).catch((err) => {
    console.error('Connection to database failed', err.message)
})
