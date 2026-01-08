import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import paymentRouter from './routes/payment'
import webhookRouter from './routes/webhook'

const port = Number(process.env.PAYMENT_SERVICE_PORT ?? process.env.PORT ?? 4001)

const app = express()

app.use(cors({ origin: 'http://localhost:3000' }))

app.use(
  bodyParser.json({
    verify: (req: express.Request & { rawBody?: string }, _res, buf) => {
      req.rawBody = buf.toString()
    },
  })
)
app.use('/api/payment', paymentRouter)
app.use('/api/payment/webhook', webhookRouter)

app.get('/healthz', (_req, res) => {
  res.json({ status: 'ok' })
})

app.listen(port, () => {
  console.log(`> Payment service ready on http://localhost:${port}`)
})
