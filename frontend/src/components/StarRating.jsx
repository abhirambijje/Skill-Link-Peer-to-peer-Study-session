import { useState } from 'react'
import { FaStar } from 'react-icons/fa'

export default function StarRating({ value, onChange, readOnly = false }) {
  const [hovered, setHovered] = useState(0)
  const display = hovered || value

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={22}
          className={`transition-colors duration-150 ${
            star <= display ? 'text-yellow-400' : 'text-gray-300'
          } ${!readOnly ? 'cursor-pointer hover:scale-110' : ''}`}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          onClick={() => !readOnly && onChange && onChange(star)}
        />
      ))}
    </div>
  )
}
