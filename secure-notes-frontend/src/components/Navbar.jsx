import { Link, useNavigate } from 'react-router-dom'
import { getToken } from '../services/api'
import { clearEncryptionKey } from '../utils/crypto'

function Navbar() {
  const navigate = useNavigate()
  const isLoggedIn = !!getToken()

  const handleLogout = () => {
    localStorage.removeItem('token')
    clearEncryptionKey()
    navigate('/login')
  }

  return (
    <nav style={{
      backgroundColor: '#333',
      padding: '10px 20px',
      marginBottom: '20px'
    }}>
      <ul style={{
        listStyle: 'none',
        display: 'flex',
        gap: '20px',
        margin: 0,
        padding: 0,
        alignItems: 'center'
      }}>
        {isLoggedIn ? (
          <>
            <li><Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Mes Notes</Link></li>
            <li>
              <button 
                onClick={handleLogout}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Déconnexion
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Connexion</Link></li>
            <li><Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Inscription</Link></li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navbar
