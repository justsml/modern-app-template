import app from "./app"

const port = parseInt(process.env.PORT || '3000')
const startMessage = `Started server on http://0.0.0.0:${port}`

app.listen(port)
    .on('error', console.error)
    .on('listening', () => console.log(startMessage))
