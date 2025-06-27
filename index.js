// src/index.js
import express from 'express'
import { domainMiddleware } from './middleware/domainMiddleware.js'
import testRoutes from './routes/test.js'

const app = express()
const PORT = 3000

app.use('/test', domainMiddleware, testRoutes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
