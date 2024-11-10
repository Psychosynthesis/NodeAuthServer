import crypto from 'crypto'

export const hashPass = async (password, salt) => {
  return new Promise((resolve, reject) => {
    const encodedSalt = Buffer.from(salt).toString('hex').substr(0, 8);

    crypto.scrypt(password, encodedSalt, 32, (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString('hex'))
    });
  })
}

export const verifyHash = async (password, hash, salt) => {
  return new Promise((resolve, reject) => {
    const encodedSalt = Buffer.from(salt).toString('hex').substr(0, 8);
    crypto.scrypt(password, encodedSalt, 32, (err, derivedKey) => {
      if (err) reject(err);
      resolve(hash == derivedKey.toString('hex'))
    });
  })
}
