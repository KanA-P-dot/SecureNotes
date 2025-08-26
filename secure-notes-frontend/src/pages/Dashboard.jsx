import { useState, useEffect } from 'react'
import { fetchNotes } from '../services/api'

function Dashboard() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadNotes()
  }, [])

  const loadNotes = async () => {
    try {
      setLoading(true)
      const data = await fetchNotes()
      setNotes(data)
    } catch (err) {
      setError('Erreur lors du chargement des notes')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Chargement...</div>

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Mes notes</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div>
        <h2>Mes notes ({notes.length})</h2>
        {notes.length === 0 ? (
          <p>Aucune note pour le moment.</p>
        ) : (
          notes.map(note => (
            <div
              key={note.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '15px',
                marginBottom: '10px',
                backgroundColor: '#f9f9f9'
              }}
            >
              <p style={{ whiteSpace: 'pre-wrap', marginBottom: '10px', color: '#333' }}>
                {note.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Dashboard
  