import { readFileSync } from 'fs'
import { verifyToken } from '../utils/token.js'
import { setCookie } from './setCookie.js';
import { getUserById, User } from '../models/User.js'
import CONFIG from '../../commons/config.json' assert { type: 'json' };
const { REFRESH_COOKIE_NAME } = CONFIG;

const PUBLIC_KEY = readFileSync('./config/public_key.pem', 'utf-8')

/*
Данный посредник проверяет токен обновления.
Если токен обновления не верен или просрочен, юзер должен быть разлогинен.
Также обновление не должно произойти, если юзер уже был разлогинен.
*/

export const verifyRefreshToken = async (req, res, next) => {
  const refreshToken = req.cookies[REFRESH_COOKIE_NAME];
  if (!refreshToken) {
    console.log('No refresh token');
    return res.status(403).json({ message: 'No refresh token' });
  }

  try {
    const decoded = await verifyToken(refreshToken, PUBLIC_KEY);
    // Если токен не просрочен, но пользователь уже вышел далее нужно проверить, не разлогинивало ли его принудительно
    const userData = await getUserById(decoded.userId);
    if (!userData) {
      console.log('User not found');
      return res.status(403).json({ message: 'User not found' })
    }

    const isLogged = await userData.isLogged();

    if (!isLogged) { // Пользователь ранее разлогинился
      console.log('Invalid refresh token');
      return res.status(403).json({ message: 'Invalid refresh token' })
    }

    req.user = { userId: userData.id, username: userData.username, email: userData.email };

    next()
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      await User.findByIdAndUpdate(user.id, { sessionStart: 0 })
      res.clearCookie(REFRESH_COOKIE_NAME);
      return res.status(401).json({ message: 'Refresh token has been expired, User logged out' })
    }

    console.error('verifyRefrech middleware')
    next(e)
  }
}
