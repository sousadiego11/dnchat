const socket = io()

socket.on('message', (message) => {
    console.log(message)
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()
    
    const typedMessage = e.target.elements.message.value

    socket.emit('clientMessage', typedMessage)

    e.target.elements.message.value = ''
})