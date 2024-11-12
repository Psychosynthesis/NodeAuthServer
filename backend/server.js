// import helmet from 'helmet'
// import * as Sentry from '@sentry/node'
// import * as Tracing from '@sentry/tracing'
import cookieParser from 'cookie-parser';
import express, { json, urlencoded } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { stringify } from 'flatted';
// import bodyParser from 'body-parser';

import { ALLOWED_ORIGIN, MONGODB_URI, /* SENTRY_DSN, */ } from './config/index.js';
import CONFIG from '../commons/config.json' assert { type: 'json' };
const { SERVER_PORT } = CONFIG;

import { checkHasRefresh, setCookie, setSecurityHeaders, verifyClient } from './middlewares/index.js';

import authRouter from './routes/auth.router.js';
import interfaceRouter from './routes/interface.router.js';

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

// app.use(helmet())
app.use(cookieParser());
app.use(setSecurityHeaders);

app.use('/', interfaceRouter);
app.use('/api/auth', cors({ origin: ALLOWED_ORIGIN, credentials: true }), verifyClient, authRouter);

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

}

app.listen(SERVER_PORT || 3000, () => {
  console.log(`Server ready on http://localhost:${SERVER_PORT || 3000}`)
})
