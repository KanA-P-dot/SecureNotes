import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import styles from './Auth.module.css'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Validation du mot de passe
  const validatePassword = (pwd) => {
    if (pwd.length < 8) return 'Le mot de passe doit faire au moins 8 caractères'
    if (!/[A-Z]/.test(pwd)) return 'Le mot de passe doit contenir au moins une majuscule'
    if (!/[a-z]/.test(pwd)) return 'Le mot de passe doit contenir au moins une minuscule'
    if (!/[0-9]/.test(pwd)) return 'Le mot de passe doit contenir au moins un chiffre'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation basique
    if (!email || !password || !confirmPassword) {
      setError('Veuillez remplir tous les champs')
      return
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Veuillez entrer une adresse email valide')
      return
    }

    // Validation mot de passe
    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      return
    }

    // Vérification confirmation
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    try {
      const res = await axios.post('http://localhost:3000/api/register', {
        email,
        password
      })
      
      setSuccess('Inscription réussie. Redirection en cours...')
      
    // on vide les champs après soumission 
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      
      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        setError('Une erreur est survenue')
      }
    }
  }

  return (
    <div className={styles['auth-container']}>
      <h2 className={styles['auth-title']}>Inscription</h2>
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
        <div className={styles['form-group']}>
          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={styles['form-input']}
          />
        </div>

        <button
          type="submit"
          className={styles['submit-btn']}
        >
          S'inscrire
        </button>
        {success && <div className={styles['success-message']}>{success}</div>}
        {error && <div className={styles['error-message']}>{error}</div>}
      </form>
    </div>
  )
}

export default Register