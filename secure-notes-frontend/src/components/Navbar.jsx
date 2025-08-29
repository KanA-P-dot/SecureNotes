import { Link, useNavigate } from 'react-router-dom'
import { getToken } from '../services/api'
import { clearEncryptionKey } from '../utils/crypto'
import styles from './Navbar.module.css'

function Navbar() {
  const navigate = useNavigate()
  const isLoggedIn = !!getToken()

  const handleLogout = () => {
    localStorage.removeItem('token')
    clearEncryptionKey()
    navigate('/login')
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles['nav-list']}>
        <Link to="/" className={styles['nav-brand']}>SecureNotes</Link>
        
        <div className={styles['nav-links']}>
          {isLoggedIn ? (
            <>
              <Link to="/" className={styles['nav-link']}>Mes Notes</Link>
              <button 
                onClick={handleLogout}
                className={styles['logout-btn']}
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles['nav-link']}>Connexion</Link>
              <Link to="/register" className={styles['nav-link']}>Inscription</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
