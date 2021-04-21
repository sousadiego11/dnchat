const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)

// Socket.io requires the raw http server
const io = socketio(server)

const port = process.env.PORT || 3000

//Gets a path to the current project followed by the public folder
const publicDirectoryPath = path.join(__dirname, '../public')

//Serves the public folder in the server
app.use(express.static(publicDirectoryPath))

io.on('connection', () => {
    console.log('web connection')
})

server.listen(port, () => {
    console.log('Server running on port', port)
})