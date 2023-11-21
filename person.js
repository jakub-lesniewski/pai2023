const mongoose = require('mongoose')

const Person = new mongoose.model('Person', new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthDate: { type: Date, required: true, transform: v => v.toISOString().slice(0, 10) },
    education: { type: Number, required: true, enum: [ 0, 1, 2 ], default: 0 }
}, {
    additionalProperties: false,
    versionKey: false
}))

const person = module.exports = {

    get: (req, res) => {
        let aggregation = []
        let limit = parseInt(req.query.limit) || 10
        let search = req.query.search || ''
        let education = []
        try {
            education = JSON.parse(req.query.education)
            if(!Array.isArray(education)) throw new Exception('education should be array of integers')
        } catch(err) {
            res.status(400).json({ error: err.message })
            return
        }
        aggregation.push({ $match: { education: { $in: education } } } )
        aggregation.push({ $match: { $or: [
            { firstName: { $regex: new RegExp(search, 'i') }},
            { lastName: { $regex: new RegExp(search, 'i') }}
        ]}})
        aggregation.push({ $sort: { lastName: 1, firstName: 1 }})
        if(req.query._id) {
            try {
                aggregation.push({ $match: { _id: new mongoose.Types.ObjectId(req.query._id) }})
            } catch(err) {
                res.status(400).json({ error: err.message })
                return    
            }
        } else {
            aggregation.push({ $limit: limit })
        }
        Person.aggregate(aggregation)
        .then(data => {
            if(req.query._id) {
                if(data.length > 0) {
                    res.json(data[0])
                } else {
                    res.status(404).json({ error: 'No such object' })
                }
            } else {
                res.json(data)
            }
        })
        .catch(err => {
            res.status(400).json({ error: err.message })
        })
    },

    post: (req, res) => {
        if(req.body._id || req.query._id) {
            res.status(400).json({ error: '_id is not allowed during the operation' })
            return
        }
        let newPerson = Person(req.body)
        newPerson.save().then((saved) => {
            res.json(saved)
        }).catch(err => {
            res.status(400).json({ error: err.message })
        })
    },

    put: (req, res) => {
        if(!req.query._id) {
            res.status(400).json({ error: '_id is obligatory during the update operation' })
            return
        }
        Person.findOneAndUpdate({ _id: req.query._id }, req.body, { new: true, runValidators: true })
            .then(updated => {
                if(updated) {
                    res.json(updated)
                } else {
                    res.status(404).json({ error: 'No such object' })
                }
            })
            .catch(err => {
                res.status(400).json({ error: err.message })
            })
    },

    delete: (req, res) => {
        if(!req.query._id) {
            res.status(400).json({ error: '_id is obligatory during the delete operation' })
            return
        }
        Person.findOneAndDelete({ _id: req.query._id }).then((deleted) => {
            if(deleted) {
                res.json(deleted)
            } else {
                res.status(404).json({ error: 'No such object' })
            }
        }).catch(err => {
            res.status(400).json({ error: err.message })
        })
    }
}