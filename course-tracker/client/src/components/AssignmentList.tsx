// client/src/components/AssignmentList.tsx
import React from 'react'

// Временный тип
interface Assignment {
  _id: string
  title: string
  status: string
}

interface AssignmentListProps {
  assignments: Assignment[]
}

const AssignmentList: React.FC<AssignmentListProps> = ({ assignments }) => {

  if (assignments.length === 0) {
    return <p className="mt-2 text-xs text-gray-500">No assignments for this module.</p>
  }

  return (
    // --- Минимальный Каркас (Tailwind) ---
    <div className="mt-3 pl-4 border-l-2 border-gray-700">
      <ul className="list-none space-y-2">
        {assignments.map((assignment) => (
          <li 
            key={assignment._id}
            className="flex items-center justify-between rounded bg-gray-700 p-2"
          >
            <span className="text-sm text-gray-300">{assignment.title}</span>
            <span className="rounded-full bg-gray-600 px-2 py-0.5 text-xs text-white">
              {assignment.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AssignmentList