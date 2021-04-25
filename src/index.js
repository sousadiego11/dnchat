const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)

// Socket.io requires the raw http server
const io = socketio(server)

const port = process.env.PORT || 3000

//Gets a path to the current project followed by the public folder
const publicDirectoryPath = path.join(__dirname, '../public')

//Serves the public folder in the server
app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New web connection!')

    socket.emit('message', 'Welcome!')
    socket.broadcast.emit('message', 'A new user has joined!')

    socket.on('clientMessage', (message, callback) => {
        const filter = new Filter()

        if(filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }

        io.emit('message', message)
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left')
    })

    socket.on('sendLocation', (currentLocation, callback) => {
        const locationURL = `https://google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}`
        io.emit('message', locationURL)
        callback()
    })
})

server.listen(port, () => {
    console.log('Server running on port', port)
})