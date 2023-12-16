module.exports = wsInstance => (ws, req) => {
    ws.on('message', rawData => {
        let data = {}
        try {
            data = JSON.parse(rawData)
        } catch(err) {
            console.error(err.message, rawData)
            return
        }
        if(data.event == 'CONNECTION') {
            console.log('WS: connected', data.sessionid)
            ws.sessionID = data.sessionid
            return
        }
        req.sessionStore.all((err, sessions) => {
            if(err) {
                console.error('WS broadcasting failed:', err.message)
                return
            }
            let session = ws.sessionID && sessions[ws.sessionID]
            if(!session) {
                console.error('WS broadcasting failed: no sender session')
                return
            }
            data.sender = session.passport && session.passport.user
            data.timestamp = new Date().toISOString()
            console.log('WS: get', JSON.stringify(data))
            wsInstance.getWss().clients.forEach(client => {
                if(client.sessionID // czy klient wysłał CONNECTION
                     && sessions[client.sessionID] // czy ma prawidłową sesję
                     && sessions[client.sessionID].passport
                     && sessions[client.sessionID].passport.user // czy jest zalogowany
                   ) {
                    console.log('WS event send to:', client.sessionID, '(' + sessions[client.sessionID].passport.user + ')')
                    client.send(JSON.stringify(data))
                }
            })
   
        })
    })
}