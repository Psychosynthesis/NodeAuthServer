import { Router, json, urlencoded } from 'express';

import { verifyAccess, verifyRefreshToken, verifyPermission, setCookie } from '../middlewares/index.js';
import { getUser, loginUser, logoutUser, registerUser, removeUser } from '../services/auth.services.js';

const router = Router({ mergeParams: true });

const jsonParser = json({ limit: "10mb" });
// create application/x-www-form-urlencoded parser
// const urlencodedParser = urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 });

router.get('/getUser', verifyAccess, getUser);
router.get('/logout', verifyAccess, logoutUser);

router.post('/register', jsonParser, registerUser);
router.post('/login', jsonParser, loginUser, setCookie);
router.post('/updateToken', verifyRefreshToken, setCookie);

router.delete('/remove', verifyAccess, verifyPermission, removeUser);

export default router
