import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { generateEncryptionKey, storeEncryptionKey } from '../utils/crypto'
import styles from './Auth.module.css'

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
    <div className={styles['auth-container']}>
      <h2 className={styles['auth-title']}>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles['form-group']}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles['form-input']}
          />
        </div>
        <div className={styles['form-group']}>
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles['form-input']}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={styles['submit-btn']}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
      {error && <div className={styles['error-message']}>{error}</div>}
    </div>
  )
}

export default Login