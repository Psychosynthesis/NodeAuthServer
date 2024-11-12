import { getUserById, User } from '../models/User.js'
import { ACCESS_TOKEN_SECRET } from '../config/index.js'
import { verifyToken } from '../utils/token.js'

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
