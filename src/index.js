const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

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

    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })
        
        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        
        socket.emit('message', generateMessage('Dungeon', 'Seja bem vindo!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Dungeon', `${user.username} entrou!`))

        callback()
    })

    socket.on('clientMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()

        if(filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }

        io.to(user.room).emit('message', generateMessage(user.username,message))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('Dungeon', `${user.username} saiu!`))
        }
    })

    socket.on('sendLocation', (currentLocation, callback) => {
        const user = getUser(socket.id)

        
        const locationURL = `https://google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}`
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, locationURL))
        callback()
    })

})

server.listen(port, () => {
    console.log('Server running on port', port)
})