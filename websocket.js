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
        data.timestamp = new Date().toISOString()
        console.log('WS:', JSON.stringify(data))
        if(data.event == 'CONNECTION') {
            ws.sessionID = req.sessionID
            return
        }
        req.sessionStore.all((err, sessions) => {
            if(err) {
                console.log('WS broadcasting failed:', err.message)
                return
            }
            wsInstance.getWss().clients.forEach(client => {
                if(client.sessionID // czy klient wysłał CONNECTION
                     && sessions[client.sessionID] // czy ma prawidłową sesję
                     && sessions[client.sessionID].passport
                     && sessions[client.sessionID].passport.user // czy jest zalogowany
                   ) {
                    console.log('WS send to:', client.sessionID, '(' + sessions[client.sessionID].passport.user + ')')
                    client.send(JSON.stringify(data))
                }
            })
   
        })
    })
}