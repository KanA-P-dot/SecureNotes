import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchNotes, addNote, rmNote, editNote } from '../services/api'
import { getStoredEncryptionKey, clearEncryptionKey } from '../utils/crypto'

function Dashboard() {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingNote, setEditingNote] = useState(null)
  const [editContent, setEditContent] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    loadNotes()
  }, [])

  const loadNotes = async () => {
    try {
      setLoading(true)
      
      // verif clé de chiffrement
      const key = getStoredEncryptionKey()
      if (!key) {
        clearEncryptionKey()
        localStorage.removeItem('token')
        navigate('/login')
        return
      }
      
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

  const handleDeleteNote = async (noteId) => {
    try {
      await rmNote(noteId)
      setNotes(notes.filter(note => note.id !== noteId))
    } catch (err) {
      setError('Erreur lors de la suppression')
      console.error(err)
    }
  }

  const startEdit = (note) => {
    setEditingNote(note.id)
    setEditContent(note.content)
  }

  const cancelEdit = () => {
    setEditingNote(null)
    setEditContent('')
  }

  const saveEdit = async (noteId) => {
    try {
      const updatedNote = await editNote(noteId, editContent)
      setNotes(notes.map(note => 
        note.id === noteId ? updatedNote : note
      ))
      setEditingNote(null)
      setEditContent('')
    } catch (err) {
      setError('Erreur lors de la modification')
      console.error(err)
    }
  }

  if (loading) return <div>Chargement...</div>


  const filteredNotes = notes.filter(note =>
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#2c3e50' }}>Mes Notes Sécurisées</h1>
      
      {error && (
        <div style={{ 
          color: '#e74c3c', 
          backgroundColor: '#fdf2f2', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </div>
      )}
      
      {/* Barre de recherche */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Rechercher dans les notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e9ecef',
            borderRadius: '8px',
            fontSize: '16px',
            outline: 'none',
            transition: 'border-color 0.3s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#007bff'}
          onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
        />
      </div>
      
      <form onSubmit={handleAddNote} style={{ marginBottom: '40px' }}>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ marginTop: '0', color: '#495057' }}>Nouvelle note</h3>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Écrivez votre nouvelle note..."
            style={{
              width: '100%',
              height: '120px',
              padding: '12px',
              border: '2px solid #e9ecef',
              borderRadius: '6px',
              marginBottom: '15px',
              color: '#333',
              fontSize: '16px',
              resize: 'vertical',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '12px 24px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
          >
            Ajouter la note
          </button>
        </div>
      </form>

      <div>
        <h2>Mes notes ({filteredNotes.length}{searchTerm && ` sur ${notes.length}`})</h2>
        {filteredNotes.length === 0 ? (
          <p>{searchTerm ? 'Aucune note trouvée pour cette recherche.' : 'Aucune note pour le moment.'}</p>
        ) : (
          filteredNotes.map(note => (
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
              {editingNote === note.id ? (
                <div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    style={{
                      width: '100%',
                      height: '80px',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      marginBottom: '10px',
                      color: '#333'
                    }}
                  />
                  <button
                    onClick={() => saveEdit(note.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      marginRight: '5px'
                    }}
                  >
                    Sauvegarder
                  </button>
                  <button
                    onClick={cancelEdit}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Annuler
                  </button>
                </div>
              ) : (
                <div>
                  <p style={{ whiteSpace: 'pre-wrap', marginBottom: '10px', color: '#333' }}>
                    {note.content}
                  </p>
                  <button
                    onClick={() => startEdit(note)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#ffc107',
                      color: 'black',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      marginRight: '5px'
                    }}
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Dashboard
  