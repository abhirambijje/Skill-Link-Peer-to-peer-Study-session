import { Link } from 'react-router-dom'
import { FaSearch, FaChalkboardTeacher, FaCalendarCheck, FaStar } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const features = [
  { icon: <FaSearch size={24} />, title: 'Find a Tutor', desc: 'Browse peer tutors by subject and rating.' },
  { icon: <FaCalendarCheck size={24} />, title: 'Book a Slot', desc: 'Pick an available time slot that works for you.' },
  { icon: <FaChalkboardTeacher size={24} />, title: 'Learn Together', desc: 'Attend your session and learn from a peer.' },
  { icon: <FaStar size={24} />, title: 'Leave a Review', desc: 'Rate your tutor and help others choose well.' },
]

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-600 to-teal-800 text-white py-24 px-4 text-center">
        <h1 className="text-5xl font-bold mb-4 leading-tight">
          Learn Smarter,<br />Together.
        </h1>
        <p className="text-teal-200 text-xl mb-8 max-w-xl mx-auto">
          SkillLink connects students with peer tutors for affordable, flexible, and collaborative learning sessions.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/tutors" className="bg-white text-teal-600 px-7 py-3 rounded-xl font-bold hover:bg-teal-50 transition text-lg shadow">
            Browse Tutors
          </Link>
          {!user && (
            <Link to="/register" className="border-2 border-white text-white px-7 py-3 rounded-xl font-bold hover:bg-white hover:text-teal-600 transition text-lg">
              Become a Tutor
            </Link>
          )}
          {user && (
            <Link to="/create-profile" className="border-2 border-white text-white px-7 py-3 rounded-xl font-bold hover:bg-white hover:text-teal-600 transition text-lg">
              Set Up Tutor Profile
            </Link>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto py-20 px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How SkillLink Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="card text-center flex flex-col items-center gap-3">
              <div className="text-teal-600">{f.icon}</div>
              <h3 className="font-semibold text-gray-800">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal-50 py-16 text-center px-4">
        <h2 className="text-2xl font-bold text-teal-700 mb-3">Ready to start learning?</h2>
        <p className="text-gray-500 mb-6">Join hundreds of students sharing knowledge on SkillLink.</p>
        <Link to="/register" className="btn-primary text-lg px-8 py-3 inline-block">
          Get Started Free
        </Link>
      </section>
    </div>
  )
}
