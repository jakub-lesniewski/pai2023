module.exports = {

    get: (req, res) => {
        switch(req.params.what) {
            case 'sessions':
                req.sessionStore.all((err, sessions) => {
                    if(err) {
                        res.status(400).json({ error: err.message })
                        return
                    }
                    res.json(sessions)
                })
                break
            default:
                res.status(404).json({ error: 'Entity not found'})
        }
    }

}