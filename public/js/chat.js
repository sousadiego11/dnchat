const socket = io()

const messageForm = document.querySelector('#message-form')
const messageFormInput = messageForm.querySelector('input')
const messageFormButton = messageForm.querySelector('button')
const sendLocationButton = document.querySelector('#send-location')
const messages = document.querySelector('#messages')

const messageTemplate = document.querySelector('#message-template').innerHTML

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message
    })
    messages.insertAdjacentHTML('beforeend', html)
})

messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    
    messageFormButton.setAttribute('disabled', 'disabled')

    const typedMessage = e.target.elements.message.value

    socket.emit('clientMessage', typedMessage, (error) => {
        messageFormButton.removeAttribute('disabled')
        messageFormInput.value = ''
        messageFormInput.focus()

        if (error) {
            return console.log('Profanity not allowed')
        }

        console.log('Message delivered')
    })
})

sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition(({ coords }) => {
        const currentPosition = {
            latitude: coords.latitude,
            longitude: coords.longitude
        }

        socket.emit('sendLocation', currentPosition, () => {
            sendLocationButton.removeAttribute('disabled')
            console.log('Location shared succesfully!')
        })
    })
})