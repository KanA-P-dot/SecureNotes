import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
// import NoteEditor from './pages/NoteEditor'
import PrivateRoute from './components/PrivateRoute'

// App principal - gère les routes
function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="main-content">
          <Routes>
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* <Route path="/note/:id" element={<PrivateRoute><NoteEditor /></PrivateRoute>} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App