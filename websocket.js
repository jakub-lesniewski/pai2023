module.exports = wsInstance => (ws, req) => {
    ws.on('message', rawData => {
        let data = {}
        try {
            data = JSON.parse(rawData)
        } catch(err) {
            console.error(err.message, rawData)
            return
        }
        wsInstance.getWss().clients.forEach(client => {
            client.send(JSON.stringify(data))
        })
    })
}