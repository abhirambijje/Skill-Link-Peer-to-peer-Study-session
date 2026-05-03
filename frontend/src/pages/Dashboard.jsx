import { useEffect, useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import API from '../services/api'
import { useAuth } from '../context/AuthContext'
import StarRating from '../components/StarRating'
import { FaGraduationCap, FaChalkboardTeacher, FaCheckCircle, FaTimes } from 'react-icons/fa'

const statusBadge = (status) => {
  const map = {
    booked:    'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [myBookings, setMyBookings] = useState([])
  const [tutorBookings, setTutorBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('student')

  // Rating modal state
  const [ratingModal, setRatingModal] = useState(null) // { tutorId, tutorName }
  const [ratingValue, setRatingValue] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [submittingRating, setSubmittingRating] = useState(false)

  const fetchBookings = useCallback(() => {
    Promise.all([
      API.get('/bookings/my').catch(() => ({ data: [] })),
      API.get('/bookings/tutor').catch(() => ({ data: [] })),
    ]).then(([myRes, tutorRes]) => {
      setMyBookings(myRes.data)
      setTutorBookings(tutorRes.data)
    }).finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await API.put(`/bookings/${bookingId}`, { status })
      toast.success(`Booking marked as ${status}`)
      fetchBookings()
    } catch {
      toast.error('Failed to update booking')
    }
  }

  const handleAddLink = async (bookingId) => {
    const link = prompt('Enter the Zoom or Google Meet link for this session:');
    if (!link) return;
    try {
      await API.put(`/bookings/${bookingId}`, { meetingLink: link });
      toast.success('Meeting link added');
      fetchBookings();
    } catch {
      toast.error('Failed to add meeting link');
    }
  }

  const openRatingModal = (tutorId, tutorName) => {
    setRatingModal({ tutorId, tutorName })
    setRatingValue(5)
    setReviewText('')
  }

  const submitRating = async () => {
    setSubmittingRating(true)
    try {
      await API.post('/ratings', {
        tutorId: ratingModal.tutorId,
        rating: ratingValue,
        review: reviewText,
      })
      toast.success('Rating submitted! Thank you.')
      setRatingModal(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit rating')
    } finally {
      setSubmittingRating(false)
    }
  }

  if (loading) return (
    <div className="flex justify-center mt-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">My Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome back, <span className="font-semibold text-teal-600">{user?.name}</span></p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Sessions Booked', value: myBookings.length, color: 'text-teal-600' },
          { label: 'Completed', value: myBookings.filter(b => b.status === 'completed').length, color: 'text-green-600' },
          { label: 'Teaching Sessions', value: tutorBookings.length, color: 'text-purple-600' },
          { label: 'Pending', value: tutorBookings.filter(b => b.status === 'booked').length, color: 'text-amber-600' },
        ].map((s) => (
          <div key={s.label} className="card text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-gray-500 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('student')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition
            ${activeTab === 'student' ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 border hover:bg-teal-50'}`}
        >
          <FaGraduationCap /> My Bookings ({myBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('tutor')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition
            ${activeTab === 'tutor' ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 border hover:bg-teal-50'}`}
        >
          <FaChalkboardTeacher /> Teaching ({tutorBookings.length})
        </button>
      </div>

      {/* Student tab — Sessions I booked */}
      {activeTab === 'student' && (
        <div className="space-y-3">
          {myBookings.length === 0 ? (
            <div className="card text-center py-16">
              <p className="text-4xl mb-3">📚</p>
              <p className="text-gray-500">You haven't booked any sessions yet.</p>
              <a href="/tutors" className="btn-primary mt-5 inline-block">Browse Tutors</a>
            </div>
          ) : (
            myBookings.map((b) => (
              <div key={b._id} className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-800">Tutor: {b.tutorId?.name}</p>
                  <p className="text-sm text-gray-500">
                    📅 {b.date} &nbsp;🕐 {b.slotId?.time}
                  </p>
                  <div className="mt-1 flex items-center gap-3">
                    {statusBadge(b.status)}
                    {b.meetingLink && b.status === 'booked' && (
                      <a href={b.meetingLink.startsWith('http') ? b.meetingLink : `https://${b.meetingLink}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-teal-600 hover:underline bg-teal-50 px-2 py-0.5 rounded">
                        🔗 Join Meeting
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {b.status === 'completed' && (
                    <button
                      onClick={() => openRatingModal(b.tutorId?._id, b.tutorId?.name)}
                      className="text-sm bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1.5 rounded-lg font-semibold transition"
                    >
                      ⭐ Rate Tutor
                    </button>
                  )}
                  {b.status === 'booked' && (
                    <button
                      onClick={() => handleStatusUpdate(b._id, 'cancelled')}
                      className="text-sm border border-red-300 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tutor tab — Sessions I'm teaching */}
      {activeTab === 'tutor' && (
        <div className="space-y-3">
          {tutorBookings.length === 0 ? (
            <div className="card text-center py-16">
              <p className="text-4xl mb-3">🎓</p>
              <p className="text-gray-500">No one has booked your sessions yet.</p>
              <a href="/create-profile" className="btn-primary mt-5 inline-block">Set Up Your Profile</a>
            </div>
          ) : (
            tutorBookings.map((b) => (
              <div key={b._id} className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-800">Student: {b.studentId?.name}</p>
                  <p className="text-sm text-gray-400 text-xs">{b.studentId?.email}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    📅 {b.date} &nbsp;🕐 {b.slotId?.time}
                  </p>
                  <div className="mt-1 flex items-center gap-3">
                    {statusBadge(b.status)}
                    {b.meetingLink && b.status === 'booked' && (
                      <a href={b.meetingLink.startsWith('http') ? b.meetingLink : `https://${b.meetingLink}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-teal-600 hover:underline bg-teal-50 px-2 py-0.5 rounded">
                        🔗 Join Meeting
                      </a>
                    )}
                  </div>
                </div>
                {b.status === 'booked' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(b._id, 'completed')}
                      className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition"
                    >
                      <FaCheckCircle size={12} /> Mark Complete
                    </button>
                    {!b.meetingLink && (
                      <button
                        onClick={() => handleAddLink(b._id)}
                        className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-semibold flex items-center transition"
                      >
                        🔗 Add Link
                      </button>
                    )}
                    <button
                      onClick={() => handleStatusUpdate(b._id, 'cancelled')}
                      className="text-sm border border-red-300 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 flex items-center gap-1 transition"
                    >
                      <FaTimes size={12} /> Cancel
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Rating Modal */}
      {ratingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Rate {ratingModal.tutorName}</h2>
              <button onClick={() => setRatingModal(null)} className="text-gray-400 hover:text-gray-700">
                <FaTimes size={18} />
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-4">How was your session? Your feedback helps others.</p>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-600 mb-2">Your Rating</p>
              <StarRating value={ratingValue} onChange={setRatingValue} />
            </div>

            <div className="mb-5">
              <p className="text-sm font-medium text-gray-600 mb-2">Review (optional)</p>
              <textarea
                placeholder="Share your experience..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={3}
                className="input-field resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setRatingModal(null)}
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={submitRating}
                disabled={submittingRating}
                className="btn-primary flex-1"
              >
                {submittingRating ? 'Submitting...' : 'Submit Rating'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
