import { useState } from 'react'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // TODO: ajouter validation email
  // TODO: verifier longueur mot de passe
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // validation qu'il rentre bien les infos
    if (!email || !password) {
      alert('Veuillez remplir tous les champs')
      return
    }
    
    console.log('Register:', { email, password })
    
    // on vide les champs après soumission 
    setEmail('')
    setPassword('')
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Inscription</h2>
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
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          S'inscrire
        </button>
      </form>
    </div>
  )
}

export default Register