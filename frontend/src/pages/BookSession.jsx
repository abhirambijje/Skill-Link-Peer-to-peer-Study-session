import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import API from '../services/api'
import { FaCalendarAlt, FaCheckCircle } from 'react-icons/fa'

export default function BookSession() {
  const { tutorId } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [slots, setSlots] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)

  useEffect(() => {
    Promise.all([
      API.get(`/tutors/${tutorId}`),
      API.get(`/tutors/${tutorId}/slots`),
    ])
      .then(([profileRes, slotsRes]) => {
        setProfile(profileRes.data)
        setSlots(slotsRes.data)
      })
      .catch(() => toast.error('Failed to load tutor info'))
      .finally(() => setLoading(false))
  }, [tutorId])

  const handleBook = async () => {
    if (!selected) {
      toast.error('Please select a time slot first')
      return
    }
    setBooking(true)
    try {
      await API.post('/bookings', {
        tutorId: profile.userId?._id || profile.userId,
        slotId: selected,
      })
      toast.success('Session booked successfully!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed')
    } finally {
      setBooking(false)
    }
  }

  if (loading) return (
    <div className="flex justify-center mt-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
    </div>
  )

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Book a Session</h1>
      {profile && (
        <p className="text-gray-500 mb-6 text-sm">
          With <span className="font-semibold text-teal-600">{profile.userId?.name}</span>
        </p>
      )}

      {slots.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-4xl mb-3">📅</p>
          <p className="text-gray-500">No available slots at the moment.</p>
          <p className="text-gray-400 text-sm mt-1">Check back later or browse other tutors.</p>
          <button onClick={() => navigate('/tutors')} className="btn-outline mt-5 inline-block">
            Browse Other Tutors
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">
            Select an available time slot below:
          </p>
          <div className="space-y-3 mb-8">
            {slots.map((slot) => (
              <div
                key={slot._id}
                onClick={() => setSelected(slot._id)}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-150 flex items-center justify-between
                  ${selected === slot._id
                    ? 'border-teal-600 bg-teal-50 shadow-sm'
                    : 'border-gray-200 hover:border-teal-300 bg-white'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-2 ${selected === slot._id ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-400'}`}>
                    <FaCalendarAlt size={14} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{slot.time}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                    </p>
                  </div>
                </div>
                {selected === slot._id && (
                  <FaCheckCircle className="text-teal-600" size={20} />
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleBook}
            disabled={!selected || booking}
            className="btn-primary w-full text-center text-base py-3"
          >
            {booking ? 'Confirming booking...' : 'Confirm Booking'}
          </button>
        </>
      )}
    </div>
  )
}
