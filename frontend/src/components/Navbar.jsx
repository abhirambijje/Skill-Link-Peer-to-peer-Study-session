import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaGraduationCap, FaBars, FaTimes } from 'react-icons/fa'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-teal-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo & Welcome */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold hover:opacity-90">
            <FaGraduationCap size={24} />
            SkillLink
          </Link>
          {user && (
            <span className="hidden md:inline-block bg-teal-800 bg-opacity-60 px-3 py-1 rounded-full text-xs font-medium border border-teal-500">
              👋 My name is {user.name?.split(' ')[0]}
            </span>
          )}
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/tutors" className={`hover:underline ${isActive('/tutors') ? 'underline' : ''}`}>
            Browse Tutors
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className={`hover:underline ${isActive('/dashboard') ? 'underline' : ''}`}>
                Dashboard
              </Link>
              <Link to="/create-profile" className={`hover:underline ${isActive('/create-profile') ? 'underline' : ''}`}>
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-white text-teal-600 px-4 py-1.5 rounded-lg font-semibold hover:bg-teal-50 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="bg-white text-teal-600 px-4 py-1.5 rounded-lg font-semibold hover:bg-teal-50 transition">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 text-sm font-medium bg-teal-700">
          <Link to="/tutors" onClick={() => setMenuOpen(false)} className="hover:underline">Browse Tutors</Link>
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="hover:underline">Dashboard</Link>
              <Link to="/create-profile" onClick={() => setMenuOpen(false)} className="hover:underline">My Profile</Link>
              <button onClick={handleLogout} className="text-left hover:underline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="hover:underline">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="hover:underline">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
