// From Dan's Guides: https://github.com/justsml/guides/tree/master/express/setup-guide
// TODO: INSTALL PRE-REQS:
//  npm install express cors morgan helmet nodemon
import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import CatRouter from './routes/cats'

export default express()
  .use(helmet())
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(morgan(process.env.NODE_ENV !== 'production' ? 'dev' : 'combined'))
  .use(cors({origin: true, credentials: true}))
  .use('/api/cat', CatRouter)
// The following 2 `app.use`'s MUST be last
  .use(notFound)
  .use(errorHandler)

function notFound(req, res) {
  res.status(404).send({error: 'Not found!', status: 404, url: req.originalUrl})
}

function errorHandler(err, req, res, next) {
  console.error('ERROR', err)
  const stack =  process.env.NODE_ENV !== 'production' ? err.stack : undefined
  res.status(500).send({error: err.message, stack, url: req.originalUrl})
}
