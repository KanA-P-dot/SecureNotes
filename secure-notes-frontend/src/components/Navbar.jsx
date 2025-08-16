import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav>
      <ul>
        <li><Link to="/">Accueil</Link></li>
        <li><Link to="/login">Connexion</Link></li>
        <li><Link to="/register">Inscription</Link></li>
        <li><button onClick={handleLogout}>Déconnexion</button></li>
      </ul>
    </nav>
  )
}

export default Navbar
