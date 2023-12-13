module.exports = wsInstance => (ws, req) => {
    ws.on('message', rawData => {
        let data = {}
        try {
            data = JSON.parse(rawData)
        } catch(err) {
            console.error(err.message, rawData)
            return
        }
        data.sender = req.session.passport ? req.session.passport.user : null
        if(data.event == 'CONNECTION') {
            ws.sessionID = req.sessionID
            return
        }
        let sessions = {}
        for(let key in req.sessionStore.sessions) {
            try {
                sessions[key] = JSON.parse(req.sessionStore.sessions[key])
            } catch(err) {}
        }
        data.timestamp = new Date().toISOString()
        wsInstance.getWss().clients.forEach(client => {
            if(client.sessionID // czy klient wysłał CONNECTION
               && sessions[client.sessionID] // czy ma prawidłową sesję
               && sessions[client.sessionID].passport
               && sessions[client.sessionID].passport.user // czy jest zalogowany
            ) {
                client.send(JSON.stringify(data))
            }
        })
    })
}