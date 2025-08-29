import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchNotes, addNote, rmNote, editNote } from '../services/api'
import { getStoredEncryptionKey, clearEncryptionKey } from '../utils/crypto'
import styles from './Dashboard.module.css'

function Dashboard() {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingNote, setEditingNote] = useState(null)
  const [editContent, setEditContent] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
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

  // Tri des notes
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at)
    } else if (sortBy === 'oldest') {
      return new Date(a.updated_at || a.created_at) - new Date(b.updated_at || b.created_at)
    } else if (sortBy === 'alphabetical') {
      return a.content.localeCompare(b.content)
    }
    return 0
  })

  return (
    <div className={styles['dashboard-container']}>
      <h1 className={styles['dashboard-title']}>Mes Notes Sécurisées</h1>
      
            
      {error && (
        <div className={styles['error-message']}>
          {error}
        </div>
      )}
      
      <div className={styles['search-container']}>
        <input
          type="text"
          placeholder="Rechercher dans les notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles['search-input']}
        />
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className={styles['sort-select']}
        >
          <option value="newest">Plus récentes</option>
          <option value="oldest">Plus anciennes</option>
          <option value="alphabetical">Alphabétique</option>
        </select>
      </div>
      
      <form onSubmit={handleAddNote}>
        <div className={styles['new-note-container']}>
          <h3 className={styles['new-note-title']}>Nouvelle note</h3>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Écrivez votre nouvelle note..."
            className={styles['new-note-textarea']}
          />
          <button
            type="submit"
            className={styles['add-note-btn']}
          >
            Ajouter la note
          </button>
        </div>
      </form>

      <div>
        <h2 className={styles['notes-list-title']}>Mes notes ({sortedNotes.length}{searchTerm && ` sur ${notes.length}`})</h2>
        {sortedNotes.length === 0 ? (
          <p>{searchTerm ? 'Aucune note trouvée pour cette recherche.' : 'Aucune note pour le moment.'}</p>
        ) : (
          sortedNotes.map(note => (
            <div key={note.id} className={styles['note-card']}>
              {editingNote === note.id ? (
                <div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className={styles['edit-textarea']}
                  />
                  <div className={styles['note-actions']}>
                    <button
                      onClick={() => saveEdit(note.id)}
                      className={styles['btn-save']}
                    >
                      Sauvegarder
                    </button>
                    <button
                      onClick={cancelEdit}
                      className={styles['btn-cancel']}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className={styles['note-content']}>
                    {note.content}
                  </p>
                  <div className={styles['note-actions']}>
                    <button
                      onClick={() => startEdit(note)}
                      className={styles['btn-edit']}
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className={styles['btn-delete']}
                    >
                      Supprimer
                    </button>
                  </div>
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
  