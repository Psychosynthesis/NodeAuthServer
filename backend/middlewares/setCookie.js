import { readFileSync } from 'fs'
import { getUserById, User } from '../models/User.js'
import { ACCESS_TOKEN_SECRET } from '../config/index.js'
import { signToken } from '../utils/token.js'

import CONFIG from '../../commons/config.json' assert { type: 'json' };
const { REFRESH_COOKIE_NAME } = CONFIG;

const PRIVATE_KEY = readFileSync('./config/private_key.pem', 'utf8')

/*
Данный посредник подписывает токен обновления и токен доступа (т.е. обновляето оба).
Токен обновления зашивается в куки, передаваемую только по HTTPS и доступную только на сервере.
Токен доступа и данные пользователя возвращаются клиенту.
Также посредник сохраняет время последнего логина (нужно для принудительного выхода из системы).
*/

export const setCookie = async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return res.status(400).json({ message: 'User must be provided' })
  }

  try {
    const userData = await getUserById(user.userId);
    if (!userData) {
      console.log('Something went wrong, user no found in DB: ', user);
      return res.status(403).json({ message: 'Something went wrong, no user found in DB' });
    }

    const accessToken = await signToken(
      { userId: user.userId, role: user.role },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    )

    let refreshToken
    if (!req.cookies[REFRESH_COOKIE_NAME]) {
      refreshToken = await signToken({ userId: user.userId }, PRIVATE_KEY, {
        algorithm: 'RS256',
        expiresIn: '2d'
      })

      res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        origin: 'http://localhost:3000', // Проверить
      })
    }

    await User.findByIdAndUpdate(userData.userId, { sessionStart: new Date().getTime() })

    res.status(200).json({
      user: { userId: userData.id, username: userData.username, email: userData.email },
      token: accessToken, // Не даём конкретное название для типа токена в ответе для усложнения анализа
     })
  } catch (e) {
    console.error('setCookie middleware error: ', e)
    next(e)
  }
}
