const socket = io()

const messageForm = document.querySelector('#message-form')
const messageFormInput = messageForm.querySelector('input')
const messageFormButton = messageForm.querySelector('button')
const sendLocationButton = document.querySelector('#send-location')
const messages = document.querySelector('#messages')

const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('message', ({username, text, createdAt}) => {
    console.log(text)
    const html = Mustache.render(messageTemplate, {
        username,
        message: text,
        createdAt: moment(createdAt).format('k:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', ({username, position, createdAt}) => {
    console.log(location)
    const html = Mustache.render(locationTemplate, {
        username,
        location: position,
        createdAt: moment(createdAt).format('k:mm a')
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

socket.emit('join', { username, room }, (error) => {
    if(error) {
        alert(error)
        location.href = '/'
    }
})
