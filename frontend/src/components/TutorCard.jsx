import { Link } from 'react-router-dom'
import { FaStar, FaBook } from 'react-icons/fa'

export default function TutorCard({ tutor }) {
  return (
    <div className="card flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-lg">
            {tutor.userId?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{tutor.userId?.name}</h2>
            <p className="text-xs text-gray-400">{tutor.userId?.email}</p>
          </div>
        </div>

        <p className="text-gray-500 text-sm mt-2 line-clamp-2">
          {tutor.bio || 'No bio provided yet.'}
        </p>

        {/* Subjects */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tutor.subjects?.length > 0 ? (
            tutor.subjects.map((s) => (
              <span key={s} className="bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-full text-xs font-medium">
                {s}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400">No subjects listed</span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-4">
        <span className="flex items-center gap-1 text-yellow-500 font-semibold text-sm">
          <FaStar size={13} />
          {tutor.rating > 0 ? `${tutor.rating}` : 'New'}
        </span>
        <Link
          to={`/tutors/${tutor._id}`}
          className="flex items-center gap-1 text-teal-600 hover:underline text-sm font-medium"
        >
          <FaBook size={12} /> View Profile
        </Link>
      </div>
    </div>
  )
}
