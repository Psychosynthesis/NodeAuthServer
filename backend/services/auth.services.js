import { User, getUserById, getUserByUsername } from '../models/User.js'
import { hashPass, verifyHash } from '../utils/hasp.js'

import { ACCESS_TOKEN_SECRET } from '../config/index.js'

import CONFIG from '../../commons/config.json' assert { type: 'json' };
const { REFRESH_COOKIE_NAME } = CONFIG;

export const getUser = async (req, res, next) => {
  const userId = req.user?.id
  if (!userId) {
    return res.status(400).json({ message: 'User ID must be provided' })
  }

  try {
    const userData = await getUserById(userId);
    if (!userData) {
      console.log('Something went wrong, no user found in DB: ', req.user);
      return res.status(403).json({ message: 'Something went wrong, no user found in DB' });
    }

    res.status(200).json({
      user: { userId: userData.id, username: userData.username, email: userData.email },
    });
  } catch (e) {
    console.error('getUser service error: ')
    next(e)
  }
}

export const registerUser = async (req, res, next) => {
  const username = req.body?.username
  const email = req.body?.mail
  const password = req.body?.pass
  // const role = req.body?.role

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email and password must be provided' })
  }

  try {
    const existingUser = await User.find({ $or: [{ username }, { email }] })

    if (Array.isArray(existingUser) && existingUser.length) {
      console.log('User exist: ', existingUser)
      return res.status(409).json({ message: 'Username or email already in use' })
    }

    const hashedPassword = await hashPass(password, username+email);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      // role
    })

    req.user = { userId: newUser.id, username, email }

    next('route')  // next('route') используется, чтобы избежать применения других middleware
  } catch (e) {
    console.error('registerUser service error: ')
    next(e)
  }
}

export const loginUser = async (req, res, next) => {
  const username = req.body?.username
  const password = req.body?.pass

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password must be provided' })
  }

  try {
    const user = await User.findOne({ username: username }).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (user.loginAttempt === -1) { // setTimeout уже вызывали
      return res.status(403).json({ message: 'Too many login attempts. User blocked, try again later.' })
    } else if (user.loginAttempt > 3) {
      await User.findByIdAndUpdate(user.id, { loginAttempt: -1 }) // Чтобы не вызывать setTimeout слишком часто
      setTimeout(() => dropLoginAttempts(user.id), 900000);
      return res.status(403).json({ message: 'Too many login attempts. User blocked, try again later.' })
    }

    const isPasswordCorrect = await verifyHash(password, user.password, user.username+user.email)

    if (!isPasswordCorrect) {
      await User.findByIdAndUpdate(user.id, { loginAttempt: user.loginAttempt + 1 })
      return res.status(403).json({ message: 'Wrong credentials' })
    }

    await User.findByIdAndUpdate(user.id, { loginAttempt: 0 })

    req.user = { username: user.username, userId: user.id, /* email: user.email, role: user.role */ }
    // Не отправляем данные пользователя при логине, т.к. в текущем фронтенде авторизация выделена в отдельное приложение
    // Это сделано для того, чтобы усложнить получение данных о приложении при анализе
    // Дополнительно было бы неплохо запретить получать страницы по маршрутам отличным от /auth без токенов в куках
    await User.findByIdAndUpdate(req.user.id, { sessionStart: new Date().getTime() })

    next();
  } catch (e) {
    console.error('loginUser service')
    next(e)
  }
}

export const logoutUser = async (req, res, next) => {
  await User.findByIdAndUpdate(req.userId, { sessionStart: 0 })
  res.clearCookie(REFRESH_COOKIE_NAME)
  res.status(200).json({ message: 'User has been logout' })
}

export const dropLoginAttempts = async (userId) => {
  try {
    await User.findByIdAndUpdate(userId, { loginAttempt: 0 });
    console.log(`UserID ${userId} login attempts dropped;`);
  } catch (e) {
    console.error(`dropLoginAttempts for userId ${userId} fail: `, e);
  }
}

export const removeUser = async (req, res, next) => {
  const username = req.body?.username

  if (!username) {
    return res.status(400).json({ message: 'Username must be provided' })
  }

  try {
    const user = await getUserByUsername(username)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    await user.remove()

    res.status(200).json({ message: `User ${username} has been removed` })
  } catch (e) {
    console.log('removeUser service')
    next(e)
  }
}
