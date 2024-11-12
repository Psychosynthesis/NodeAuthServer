import CONFIG from '../../commons/config.json' assert { type: 'json' };
const { VERIFICATION_CODE } = CONFIG;

// Данный посредник проверяет, валиден ли клиент отправивший данные
export const verifyClient = async (req, res, next) => {
  const verificationCode = req.headers['x-verification-code'];

  if (!verificationCode || verificationCode !== VERIFICATION_CODE) {
    return res.status(403).json({ message: 'No verification code' })
  }

  next();
}
