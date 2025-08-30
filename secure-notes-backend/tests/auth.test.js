import assert from 'assert'
import request from 'supertest'
import express from 'express'
import authRoutes from '../routes/auth.js'

// Application de test
const app = express()
app.use(express.json())
app.use('/api', authRoutes)

console.log('Demarrage des tests d authentification...')

// Test 1
try {
  const response = await request(app)
    .post('/api/register')
    .send({ password: 'test123' })
    
  assert.strictEqual(response.status, 400)
  assert.strictEqual(response.body.message, 'Email et mot de passe requis')
  console.log('Test 1 reussi : Refus inscription sans email')
} catch (error) {
  console.log('Test 1 echoue :', error.message)
}

// Test 2  
try {
  const response = await request(app)
    .post('/api/login')
    .send({})
    
  assert.strictEqual(response.status, 400)
  assert.strictEqual(response.body.message, 'Email et mot de passe requis')
  console.log('Test 2 reussi : Refus connexion sans identifiants')
} catch (error) {
  console.log('Test 2 echoue :', error.message)
}

console.log('Tests terminés')
