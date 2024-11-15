import { readFileSync } from 'fs'
import { verifyToken } from '../utils/token.js'
import { setCookie } from './setCookie.js';
import { getUserById, User } from '../models/User.js'
import CONFIG from '../../commons/config.json' assert { type: 'json' };
const { REFRESH_COOKIE_NAME } = CONFIG;

const PUBLIC_KEY = readFileSync('./config/public_key.pem', 'utf-8')

/*
Это вспомогательная проверка, чтобы исключить загрузку основной части интерфейса приложения пользователями,
которые ранее не логинились в систему У всех остальных будет установлен токен обновления, даже не валидный
*/

export const checkHasRefresh = async (req, res, next) => {
  const refreshToken = req.cookies[REFRESH_COOKIE_NAME];

  if (req.method !== 'GET' || (process.env.NODE_ENV !== 'production')) {
    // Это нужно только для GET-методов, чтобы закрыть основную часть интерфейса от тех, кто никогда не логинился
    // Всё это нужно тестировать
    return next();
  }

  if (!refreshToken) {
    return res.redirect('/login'); // Токена нет, редирект
  }

  try {
    console.log('Requested resource: ',  req.originalUrl);
    console.log('refreshToken: ', refreshToken);
    const decoded = await verifyToken(refreshToken, PUBLIC_KEY);
    // Если токен не просрочен, но пользователь уже вышел далее нужно проверить, не разлогинивало ли его принудительно
    const userData = await getUserById(decoded.userId);
    if (!userData) {
      return res.redirect('/login'); // токен верен, но пользователь не найден
    }
    req.user = { userId: userData.id, username: userData.username, email: userData.email };

    next()
  } catch (e) {
    if (e.name === 'JsonWebTokenError') {
      console.log('JsonWebTokenError')
      res.clearCookie(REFRESH_COOKIE_NAME);
      return res.redirect('/login'); // Токен не валиден, редирект
    } else if (e.name === 'TokenExpiredError') {
      res.clearCookie(REFRESH_COOKIE_NAME);
      console.log('TokenExpiredError')
      // Токен валиден, но просрочен, можно показывать интерфейс
      return next();
    } else {
      console.log('checkHasRefresh middleware error')
      next(e);
    }
  }
}
