import express, { Router } from 'express';

import { checkHasRefresh } from '../middlewares/index.js';

const router = Router({ mergeParams: true });

// !!! checkHasRefresh не проверяет POST-методы !!!
router.use('/assets', express.static('./public/assets'));
router.use('/list', checkHasRefresh, express.static('./public'));
router.use('/login', express.static('./public/auth'));
router.use('/register', express.static('./public/auth'));

export default router
