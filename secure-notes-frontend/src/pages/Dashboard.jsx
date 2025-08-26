import { useState, useEffect } from 'react'
import { fetchNotes, addNote } from '../services/api'

function Dashboard() {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
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

  const handleAddNote = async (e) => {
    e.preventDefault()
    if (!newNote.trim()) return

    try {
      const note = await addNote(newNote)
      setNotes([...notes, note])
      setNewNote('')
    } catch (err) {
      setError('Erreur lors de la création de la note')
      console.error(err)
    }
  }

  if (loading) return <div>Chargement...</div>

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Mes Notes Sécurisées</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleAddNote} style={{ marginBottom: '30px' }}>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Ecrivez votre nouvelle note..."
          style={{
            width: '100%',
            height: '100px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            marginBottom: '10px',
            color: '#333'
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Ajouter la note
        </button>
      </form>

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
  