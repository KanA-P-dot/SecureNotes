import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { db } from '../database.js'

const router = express.Router()

router.post('/register', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis' })
  }

  try {
    // Vérifier si l'utilisateur existe déjà
    db.get('SELECT email FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur interne du serveur' })
      }
      
      if (row) {
        return res.status(400).json({ message: 'Email déjà utilisé' })
      }

      // Hasher le mot de passe et créer l'utilisateur
      const hashedPassword = await bcrypt.hash(password, 10)
      
      db.run('INSERT INTO users (email, password) VALUES (?, ?)', 
        [email, hashedPassword], 
        function(err) {
          if (err) {
            return res.status(500).json({ message: 'Erreur lors de la création du compte' })
          }
          
          res.json({ message: 'Utilisateur enregistré avec succès' })
        }
      )
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erreur interne du serveur' })
  }
})

router.post('/login', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis' })
  }

  // Rechercher l'utilisateur dans la base
  db.get('SELECT email, password FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur interne du serveur' })
    }
    
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' })
    }

    try {
      const validPassword = await bcrypt.compare(password, user.password)
      if (!validPassword) {
        return res.status(401).json({ message: 'Identifiants invalides' })
      }

      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' })
      res.json({ token })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Erreur interne du serveur' })
    }
  })
})

export default router
