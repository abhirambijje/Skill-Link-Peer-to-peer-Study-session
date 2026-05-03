import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import TutorList from './pages/TutorList'
import TutorProfile from './pages/TutorProfile'
import CreateProfile from './pages/CreateProfile'
import Dashboard from './pages/Dashboard'
import BookSession from './pages/BookSession'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/tutors" element={<TutorList />} />
            <Route path="/tutors/:id" element={<TutorProfile />} />
            <Route
              path="/create-profile"
              element={<ProtectedRoute><CreateProfile /></ProtectedRoute>}
            />
            <Route
              path="/dashboard"
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
            <Route
              path="/book/:tutorId"
              element={<ProtectedRoute><BookSession /></ProtectedRoute>}
            />
          </Routes>
        </main>
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </AuthProvider>
  )
}
