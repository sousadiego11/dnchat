const path = require('path')
const express = require('express')
const app = express()

const port = process.env.PORT || 3000

//Gets a path to the current project followed by the public folder
const publicDirectoryPath = path.join(__dirname, '../public')

//Serves the public folder in the server
app.use(express.static(publicDirectoryPath))

app.listen(port, () => {
    console.log('Server running on port', port)
})