import { describe, test, expect } from 'vitest'
import { encryptText, decryptText, generateEncryptionKey } from '../utils/crypto'

describe('Tests de chiffrement', () => {
  
  test('doit chiffrer et déchiffrer correctement', () => {
    const texte = 'Ma note secrète'
    const cle = 'ma-cle-secrete'
    
    const texteChiffre = encryptText(texte, cle)
    const texteDechiffre = decryptText(texteChiffre, cle)
    
    expect(texteDechiffre).toBe(texte)
    expect(texteChiffre).not.toBe(texte)
  })

  test('doit générer une clé de chiffrement', () => {
    const email = 'test@test.com'
    const password = 'motdepasse123'
    
    const cle1 = generateEncryptionKey(email, password)
    const cle2 = generateEncryptionKey(email, password)
    
    expect(cle1).toBe(cle2)
    expect(cle1).toHaveLength(64)
  })

  test('ne doit pas déchiffrer avec une mauvaise clé', () => {
    const texte = 'Ma note secrète'
    const bonneCle = 'ma-cle-secrete'
    const mauvaiseCle = 'mauvaise-cle'
    
    const texteChiffre = encryptText(texte, bonneCle)
    const texteDechiffre = decryptText(texteChiffre, mauvaiseCle)
    
    expect(texteDechiffre).not.toBe(texte)
  })
})
