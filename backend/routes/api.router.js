import { Router } from 'express'
import { verifyClient } from '../middlewares/index.js'
import apiRouter from './auth.routes.js'

const router = Router()

router.route('/auth', verifyClient, apiRouter);

export default router
