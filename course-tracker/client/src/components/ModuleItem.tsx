// client/src/components/ModuleItem.tsx
import { useState, useEffect } from 'react'
import assignmentService from '../services/assignmentService'
import AssignmentList from './AssignmentList'

// Типы
interface Module {
  _id: string
  title: string
  description: string
}
interface Assignment {
  _id: string
  title: string
  status: string
}

interface ModuleItemProps {
  module: Module 
}

const ModuleItem: React.FC<ModuleItemProps> = ({ module }) => {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await assignmentService.getAssignmentsForModule(module._id)
        setAssignments(data)
      } catch (error) {
        console.error('Failed to fetch assignments:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAssignments()
  }, [module._id]) 

  return (
    <div className="rounded-lg bg-gray-800 p-4 shadow">
      <h3 className="text-lg font-semibold text-white">{module.title}</h3>
      <p className="mt-1 text-sm text-gray-400">{module.description}</p>

      {isLoading ? (
        <p className="mt-2 text-xs text-gray-500">Loading assignments...</p>
      ) : (
        <AssignmentList assignments={assignments} />
      )}
    </div>
  )
}

export default ModuleItem