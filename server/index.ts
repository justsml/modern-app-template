import app from "./app"

const port = parseInt(process.env.PORT || '3000')

app.listen(port)
    .on('error', console.error)
    .on('listening', console.log)

