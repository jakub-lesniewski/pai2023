const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: { type: String, required: true },
    project: { type: mongoose.ObjectId , required: true },
    startDate: { type: Date, required: true, transform: v => v.toISOString().slice(0, 10) },
    endDate: { type: Date, required: false, transform: v => v.toISOString().slice(0, 10) },
    performers: { type: [ mongoose.ObjectId ], required: false, default: [] }

}, {
    versionKey: false,
    additionalProperties: false
})

let model = null

module.exports = {

    getSchema: () => schema,
    getModel: () => model,

    init: connection => {
        model = connection.model('Task', schema)
        return model
    },

    get: (req, res) => {
        const _id = req.query._id
        if(_id) {
            model.findOne({ _id })
            .then(data => {
                if(data) {
                    res.json(data)
                } else {
                    res.status(404).json({ error: 'No such object' })
                }
            })
            .catch(err => {
                res.status(408).json({ error: err.message })
            })
        } else {
            let aggregation = [
                { $sort: { name: 1 }},
                { $match: { $or: [ 
                    { name: { $regex: new RegExp(req.query.search, 'i') } },
                ]}},
                
            ]

            aggregation.push({ $lookup: {
                from: 'projects',
                pipeline: [
                    { $sort: { name: 1 }}
                ],
                localField: 'project',
                foreignField: '_id',
                as: 'project'
            }})
            aggregation.push({ $lookup: {
                from: 'people',
                pipeline: [
                    { $sort: { name: 1 }}
                ],
                localField: 'performers',
                foreignField: '_id',
                as: 'performers'
            }})
            model.aggregate(aggregation)
            .then(data => {
                res.json(data)
            })
            .catch(err => {
                res.status(408).json({ error: err.message })
            })
        }
    },

    post: (req, res) => {
        const instance = new model(req.body)
        instance.save()
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            res.status(406).json({ error: err.message })
        })    
    },

    put: (req, res) => {
        const taskArray = req.body.tasks;

        if(taskArray)
        {
            const currentDate = new Date();
        
        Promise.all(taskArray.map(taskId =>
            model.findOneAndUpdate({ _id: taskId }, { endDate: currentDate }, { new: true, runValidators: true })
            ))
            .then(updated => {
                if(updated) {
                    res.json(updated)
                } else {
                    res.status(404).json({ error: 'No such object' })
                }
                })
                .catch(err => {
                    res.status(406).json({ error: err.message })
                })  
                
        }
        else {
            const _id = req.query._id
            model.findOneAndUpdate({ _id }, req.body, { new: true, runValidators: true })
            .then(updated => {
                if(updated) {
                    res.json(updated)
                } else {
                    res.status(404).json({ error: 'No such object' })
                }
            })
            .catch(err => {
                res.status(406).json({ error: err.message })
            })    
        }
    },

    delete: (req, res) => {
        const _id = req.query._id
        model.findOneAndDelete({ _id }).then(deleted => {
            if(deleted) {
                res.json(deleted)
            } else {
                res.status(404).json({ error: 'No such object' })
            }
        }).catch(err => {
            res.status(400).json({ error: err.message })
        })
    
    },

    

}