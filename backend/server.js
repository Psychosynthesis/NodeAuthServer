// import helmet from 'helmet'
// import * as Sentry from '@sentry/node'
// import * as Tracing from '@sentry/tracing'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { json, urlencoded } from 'express'
import mongoose from 'mongoose'
import { stringify } from 'flatted';
// import bodyParser from 'body-parser';

import { ALLOWED_ORIGIN, MONGODB_URI, /* SENTRY_DSN, */ } from './config/index.js'
import CONFIG from '../commons/config.json' assert { type: 'json' };
const { SERVER_PORT } = CONFIG;

import { checkHasRefresh, setCookie, setSecurityHeaders } from './middlewares/index.js'
import apiRoutes from './routes/api.router.js'

const app = express();
app.disable('x-powered-by'); // Remove unnecs header

/*
if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app })
    ],
    tracesSampleRate: 1.0
  })

  app.use(Sentry.Handlers.requestHandler())
  app.use(Sentry.Handlers.tracingHandler())
}
*/

app.use(cors({ origin: ALLOWED_ORIGIN, credentials: true }))

// app.use(helmet())
app.use(cookieParser())
app.use(setSecurityHeaders)

app.use('/api', apiRoutes);
app.use('/login', express.static('./public/auth/index.html'));
app.use('/register', express.static('./public/auth/index.html'));
app.use('/list', checkHasRefresh, express.static('./public'));
app.use('/', express.static('./public'));

if (MONGODB_URI) {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      family: 4, // Подключение по IP4
    })
    console.log('Connected to DB')
  } catch (e) {
    console.error(`Error while connecting to DB: ${e}`)
  }
}

if (process.env.NODE_ENV === 'production') {
  // app.use(Sentry.Handlers.errorHandler())
} else {
  app.use('/api', (err, req, res, next) => {
    console.error(`${err.message || stringify(err, null, 2)}`)
    res.status(500).json({ message: 'Something went wrong. Try again later' })
  });
}

app.listen(SERVER_PORT || 3000, () => {
  console.log(`Server ready on http://localhost:${SERVER_PORT || 3000}`)
})
