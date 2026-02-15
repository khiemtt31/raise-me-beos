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

const port = Number(process.env.PAYMENT_SERVICE_PORT ?? 4001)
const nodeEnv = process.env.NODE_ENV || 'development'

console.log(`[Startup] Environment: ${nodeEnv}`)
console.log(`[Startup] Port: ${port}`)
console.log(`[Startup] CORS Origins: ${process.env.CORS_ORIGINS || 'http://localhost:3000'}`)

const app = express()

app.use(helmet())
app.use(hpp())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many requests, please try again later.' },
  skip: (req) => req.path.startsWith('/api/payment/webhook') 
})
app.use(limiter)

const allowedOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:3000']

app.set('trust proxy', 1);

app.use(cors({ 
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 
}));

app.use(
  bodyParser.json({
    limit: '1mb',
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
  res.json({ status: 'ok', message: "Payment service is healthy" })
})

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
