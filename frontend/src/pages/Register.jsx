import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import API from '../services/api'
import { useAuth } from '../context/AuthContext'
import { FaGraduationCap } from 'react-icons/fa'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const { data } = await API.post('/auth/register', form)
      login(data.token, data.user)
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <div className="flex items-center justify-center gap-2 text-teal-600 mb-6">
          <FaGraduationCap size={32} />
          <span className="text-2xl font-bold">SkillLink</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">Create your account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
            <input name="name" placeholder="John Doe" value={form.name} onChange={handleChange}
              className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange}
              className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
            <input name="password" type="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange}
              className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">I want to join as</label>
            <select name="role" value={form.role} onChange={handleChange} className="input-field">
              <option value="student">Student (looking for tutors)</option>
              <option value="tutor">Tutor (I want to teach)</option>
              <option value="both">Both (Student & Tutor)</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-teal-600 font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}
