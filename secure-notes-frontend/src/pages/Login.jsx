import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { generateEncryptionKey, storeEncryptionKey } from '../utils/crypto'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // validation qu'il rentre bien les infos
    if (!email || !password) {
      setError('Veuillez remplir tous les champs')
      return
    }

    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Veuillez entrer une adresse email valide')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        email,
        password
      })
      
      const token = response.data.token
      localStorage.setItem('token', token)
      
      // genere clé de chiffrement
      const key = generateEncryptionKey(email, password)
      storeEncryptionKey(key)
      
      navigate('/') // Redirige vers Dashboard
    } catch (err) {
      console.error(err)
      if (err.response?.status === 401) {
        setError('Email ou mot de passe incorrect')
      } else if (err.response?.status >= 500) {
        setError('Erreur serveur, veuillez réessayer plus tard')
      } else {
        setError('Une erreur est survenue lors de la connexion')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: loading ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  )
}

export default Login