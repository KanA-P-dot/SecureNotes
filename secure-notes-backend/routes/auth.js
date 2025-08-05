import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { users } from '../users.js'

const router = express.Router()

router.post('/register', async (req, res) => {
  const { email, password } = req.body

  const userExists = users.find(u => u.email === email)
  if (userExists) return res.status(400).json({ message: 'Email déjà utilisé' })

  const hashed = await bcrypt.hash(password, 10)
  users.push({ email, password: hashed })

  res.json({ message: 'Utilisateur enregistré avec succès' })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = users.find(u => u.email === email)
  if (!user) return res.status(401).json({ message: 'Identifiants invalides' })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return res.status(401).json({ message: 'Identifiants invalides' })

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' })
  res.json({ token })
})

export default router
