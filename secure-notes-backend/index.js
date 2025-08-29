import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import notesRoutes from './routes/notes.js'
import { initDatabase, closeDatabase } from './database.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api', authRoutes)
app.use('/api/notes', notesRoutes)

const PORT = process.env.PORT || 3000

// Initialisation de la base de données puis démarrage du serveur
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Erreur lors de l\'initialisation de la base de données:', err)
    process.exit(1)
  })

// Fermeture propre de la base de données
process.on('SIGINT', async () => {
  console.log('\nFermeture du serveur...')
  await closeDatabase()
  process.exit(0)
})
