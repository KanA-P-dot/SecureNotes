import CryptoJS from 'crypto-js'

// fonctions pour chiffrer les notes côté client

export const generateEncryptionKey = (email, password) => {
  const combined = email + password + 'secret_salt_42'
  return CryptoJS.SHA256(combined).toString()
}

export const encryptText = (text, key) => {
  return CryptoJS.AES.encrypt(text, key).toString()
}

export const decryptText = (encryptedText, key) => {
  const bytes = CryptoJS.AES.decrypt(encryptedText, key)
  return bytes.toString(CryptoJS.enc.Utf8)
}

export const storeEncryptionKey = (key) => {
  sessionStorage.setItem('encKey', key)
}

export const getStoredEncryptionKey = () => {
  return sessionStorage.getItem('encKey')
}

export const clearEncryptionKey = () => {
  sessionStorage.removeItem('encKey')
}