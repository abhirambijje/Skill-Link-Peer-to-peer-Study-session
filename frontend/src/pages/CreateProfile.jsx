import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import API from '../services/api'
import { FaPlus, FaTrash, FaClock } from 'react-icons/fa'

export default function CreateProfile() {
  const [bio, setBio] = useState('')
  const [subjects, setSubjects] = useState([])
  const [subjectInput, setSubjectInput] = useState('')
  const [slots, setSlots] = useState([])
  const [slotDate, setSlotDate] = useState('')
  const [slotTime, setSlotTime] = useState('')
  const [saving, setSaving] = useState(false)
  const [addingSlot, setAddingSlot] = useState(false)

  // Load existing profile if any
  useEffect(() => {
    API.get('/tutors/my-profile')
      .then((res) => {
        setBio(res.data.bio || '')
        setSubjects(res.data.subjects || [])
      })
      .catch(() => {})
  }, [])

  const addSubject = () => {
    const s = subjectInput.trim()
    if (s && !subjects.includes(s)) {
      setSubjects([...subjects, s])
      setSubjectInput('')
    }
  }

  const removeSubject = (s) => setSubjects(subjects.filter((x) => x !== s))

  const handleSaveProfile = async () => {
    if (!bio || subjects.length === 0) {
      toast.error('Please add a bio and at least one subject')
      return
    }
    setSaving(true)
    try {
      await API.post('/tutors/profile', { subjects, bio })
      toast.success('Profile saved successfully!')
    } catch {
      toast.error('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const handleAddSlot = async () => {
    if (!slotDate || !slotTime) {
      toast.error('Please select both date and time')
      return
    }
    setAddingSlot(true)
    try {
      const res = await API.post('/tutors/slots', { time: `${slotDate} ${slotTime}` })
      setSlots([...slots, res.data])
      toast.success('Time slot added!')
      setSlotDate('')
      setSlotTime('')
    } catch {
      toast.error('Failed to add slot')
    } finally {
      setAddingSlot(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tutor Profile Setup</h1>
        <p className="text-gray-500 text-sm mt-1">Set up your profile so students can find and book you.</p>
      </div>

      {/* Bio */}
      <section className="card space-y-3">
        <h2 className="font-semibold text-gray-700 text-lg">About You</h2>
        <textarea
          placeholder="Tell students about yourself, your teaching style, experience..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          className="input-field resize-none"
        />

        {/* Subjects */}
        <h2 className="font-semibold text-gray-700">Subjects You Teach</h2>
        <div className="flex gap-2">
          <input
            placeholder="e.g. Mathematics, Physics..."
            value={subjectInput}
            onChange={(e) => setSubjectInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSubject()}
            className="input-field"
          />
          <button onClick={addSubject} className="btn-primary px-4 flex items-center gap-1">
            <FaPlus size={12} /> Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {subjects.map((s) => (
            <span key={s} className="bg-teal-100 text-teal-700 border border-teal-200 px-3 py-1 rounded-full text-sm flex items-center gap-1">
              {s}
              <button onClick={() => removeSubject(s)} className="ml-1 text-teal-400 hover:text-red-500">
                <FaTrash size={10} />
              </button>
            </span>
          ))}
        </div>

        <button onClick={handleSaveProfile} disabled={saving} className="btn-primary w-full">
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </section>

      {/* Time Slots */}
      <section className="card space-y-3">
        <h2 className="font-semibold text-gray-700 text-lg flex items-center gap-2">
          <FaClock /> Add Available Time Slots
        </h2>
        <p className="text-gray-400 text-sm">Students will see these slots and book one.</p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Date</label>
            <input type="date" value={slotDate} onChange={(e) => setSlotDate(e.target.value)}
              className="input-field" min={new Date().toISOString().split('T')[0]} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Time</label>
            <input type="time" value={slotTime} onChange={(e) => setSlotTime(e.target.value)}
              className="input-field" />
          </div>
        </div>

        <button onClick={handleAddSlot} disabled={addingSlot} className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 w-full transition disabled:opacity-50">
          {addingSlot ? 'Adding...' : '+ Add Slot'}
        </button>

        {slots.length > 0 && (
          <div className="mt-2 space-y-2">
            <p className="text-xs text-gray-400 font-medium">Newly added slots this session:</p>
            {slots.map((s) => (
              <div key={s._id} className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm text-green-700">
                🕐 {s.time}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
