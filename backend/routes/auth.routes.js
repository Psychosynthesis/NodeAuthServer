import { Router, json, urlencoded } from 'express';

import { verifyAccess, verifyRefreshToken, verifyPermission, setCookie } from '../middlewares/index.js';
import { getUser, loginUser, logoutUser, registerUser, removeUser } from '../services/auth.services.js';

const router = Router(); // Все роуты в этом роутере идут с префиксом '/auth/'

const jsonParser = json({ limit: "10mb" });
// create application/x-www-form-urlencoded parser
const urlencodedParser = urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 });

router.post('/register', jsonParser, registerUser);
router.post('/login', jsonParser, loginUser, setCookie);
router.use('/updateToken', verifyRefreshToken).post('/updateToken', setCookie);

router.use('/getUser', verifyAccess).get('/getUser', getUser);
router.use('/logout', verifyAccess).get('/logout', logoutUser);

router.delete('/remove', [verifyAccess, verifyPermission], removeUser);

export default router;
