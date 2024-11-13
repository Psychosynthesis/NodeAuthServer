import { readFileSync } from 'fs'

import { getUserById, User } from '../models/User.js'
import { ACCESS_TOKEN_SECRET } from '../config/index.js'
import { verifyToken, signToken } from '../utils/token.js'

import CONFIG from '../../commons/config.json' assert { type: 'json' };
const { REFRESH_COOKIE_NAME } = CONFIG;

const PRIVATE_KEY = readFileSync('./config/private_key.pem', 'utf8')

export const verifyAccess = async (req, res, next) => {
  const accessToken = req.headers['x-csrf-token'];
  if (!accessToken) {
    return res.status(403).json({ message: 'No access token' }); // Токена нет
  }

  try {
    const decoded = await verifyToken(accessToken, ACCESS_TOKEN_SECRET)
    const userData = await getUserById(decoded.userId);

    if (!decoded || !userData) {
      return res.status(403).json({ message: 'Invalid access token' })
    }

    const isLogged = await userData.isLogged();

    if (!isLogged) { // Пользователь ранее разлогинился
      throw new Error('TokenExpiredError');
    }

    // Обновим токен обновления, чтобы не было ошибок при GET-запросах
    const refreshToken = await signToken(
      { userId: userData.id },
      PRIVATE_KEY,
      { algorithm: 'RS256', expiresIn: '2d' }
    )

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      origin: 'http://localhost:3000', // Проверить
    })

    req.user = userData;
    next()
  } catch (e) {
    if (e.name === 'TokenExpiredError' || e.message === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Access token has been expired' })
    }

    console.log('verifyAccess middleware')
    next(e)
  }
}
