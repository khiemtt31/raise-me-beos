import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import hpp from 'hpp'
import paymentRouter from './routes/payment'
import webhookRouter from './routes/webhook'
import sseRouter from './routes/sse'
import donationsRouter from './routes/donations'

dotenv.config()

const port = Number(process.env.PORT ?? process.env.PAYMENT_SERVICE_PORT ?? 4001)

const app = express()

// Security Middleware
app.use(helmet())
app.use(hpp())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many requests, please try again later.' },
  skip: (req) => req.path.startsWith('/api/payment/webhook') // Skip rate limiting for webhooks
})
app.use(limiter)

const allowedOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:3000']

app.use(cors({ 
  origin: allowedOrigins,
  credentials: true
}))

app.use(
  bodyParser.json({
    limit: '50kb', // Limit body size to prevent DoS
    verify: (req: express.Request & { rawBody?: string }, _res, buf) => {
      req.rawBody = buf.toString()
    },
  })
)
app.use('/api/payment', paymentRouter)
app.use('/api/payment/webhook', webhookRouter)
app.use('/api/sse', sseRouter)
app.use('/api/donations', donationsRouter)

app.get('/healthz', (_req, res) => {
  res.json({ status: 'ok' })
})

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err)
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  })
})

app.listen(port, '0.0.0.0', () => {
  console.log(`> Payment service ready on port ${port}`)
})
