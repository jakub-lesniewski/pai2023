const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const config = {
    port: 8000,
    frontend: './frontend/dist'
}

const app = express()

app.use(morgan('tiny'))
app.use(cors())
app.use(bodyParser.json())

app.use(express.static(config.frontend))

let test = 0

// pobieranie danych
app.get('/test', (req, res) => {
    res.json({ test })
})

// ustawienie danych
app.post('/test', (req, res) => {
    if(typeof req.body.test != 'number') {
        res.status(400).json({ error: req.body.test + ' is not a number'})
        return
    }
    test = req.body.test
    res.json({ test })
})

// inkrementacja danych
app.put('/test', (req, res) => {
    if(typeof req.body.delta != 'number') {
        res.status(400).json({ error: req.body.delta + ' is not a number'})
        return
    }
    test += req.body.delta
    res.json({ test })
})

// zerowanie danych
app.delete('/test', (req, res) => {
    test = 0
    res.json({ test })
})

app.listen(config.port, () => {
    console.log('Backend listening on port', config.port)
})