import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import API from '../services/api'
import StarRating from '../components/StarRating'
import { useAuth } from '../context/AuthContext'
import { FaCalendarAlt, FaBookOpen } from 'react-icons/fa'

export default function TutorProfile() {
  const { id } = useParams()
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      API.get(`/tutors/${id}`),
      API.get(`/ratings/${id}`).catch(() => ({ data: [] })),
    ]).then(([profileRes, ratingsRes]) => {
      setProfile(profileRes.data)
      setRatings(ratingsRes.data)
    }).finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="flex justify-center mt-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
    </div>
  )

  if (!profile) return (
    <div className="text-center mt-20 text-gray-400">Tutor not found.</div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Profile Card */}
      <div className="card mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-2xl font-bold">
            {profile.userId?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{profile.userId?.name}</h1>
            <p className="text-gray-400 text-sm">{profile.userId?.email}</p>
          </div>
        </div>

        <p className="text-gray-600 mb-4">{profile.bio || 'No bio provided.'}</p>

        {/* Subjects */}
        <div className="flex flex-wrap gap-2 mb-4">
          {profile.subjects?.map((s) => (
            <span key={s} className="bg-teal-100 text-teal-700 border border-teal-200 px-3 py-1 rounded-full text-sm font-medium">
              <FaBookOpen className="inline mr-1" size={11} />{s}
            </span>
          ))}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-5">
          <StarRating value={Math.round(profile.rating)} readOnly />
          <span className="text-gray-500 text-sm">
            {profile.rating > 0 ? `${profile.rating} out of 5` : 'No ratings yet'}
          </span>
        </div>

        {/* Book button */}
        {user && user.id !== profile.userId?._id && (
          <Link
            to={`/book/${profile._id}`}
            className="btn-primary flex items-center gap-2 w-fit"
          >
            <FaCalendarAlt size={14} /> Book a Session
          </Link>
        )}
        {!user && (
          <Link to="/login" className="btn-primary w-fit inline-block">
            Login to Book a Session
          </Link>
        )}
      </div>

      {/* Reviews */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Reviews ({ratings.length})
        </h2>
        {ratings.length === 0 ? (
          <p className="text-gray-400 text-sm">No reviews yet. Be the first to rate this tutor!</p>
        ) : (
          ratings.map((r) => (
            <div key={r._id} className="card mb-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-sm font-bold">
                  {r.studentId?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">{r.studentId?.name}</p>
                  <StarRating value={r.rating} readOnly />
                </div>
              </div>
              {r.review && <p className="text-gray-600 text-sm mt-2 ml-10">{r.review}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
