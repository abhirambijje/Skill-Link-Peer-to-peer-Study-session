import { useEffect, useState } from 'react'
import API from '../services/api'
import TutorCard from '../components/TutorCard'
import { FaSearch } from 'react-icons/fa'

export default function TutorList() {
  const [tutors, setTutors] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/tutors')
      .then((res) => setTutors(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = tutors.filter((t) => {
    const q = search.toLowerCase()
    return (
      t.userId?.name?.toLowerCase().includes(q) ||
      t.bio?.toLowerCase().includes(q) ||
      t.subjects?.some((s) => s.toLowerCase().includes(q))
    )
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Browse Tutors</h1>
      <p className="text-gray-500 mb-6">Find a peer tutor by subject or name</p>

      {/* Search */}
      <div className="relative mb-8 max-w-md">
        <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by subject or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {loading ? (
        <div className="flex justify-center mt-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🎓</p>
          <p className="text-lg">No tutors found{search ? ` for "${search}"` : ''}.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((t) => (
            <TutorCard key={t._id} tutor={t} />
          ))}
        </div>
      )}
    </div>
  )
}
