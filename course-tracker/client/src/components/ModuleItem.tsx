// client/src/components/ModuleItem.tsx
import { useState, useEffect } from 'react'
import assignmentService from '../services/assignmentService'
import AssignmentList from './AssignmentList'
import Modal from './Modal'
import CreateAssignmentForm from './CreateAssignmentForm' 

// ტიპები
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
    const [isModalOpen, setIsModalOpen] = useState(false)
  const fetchAssignments = async () => {
    try {
      setIsLoading(true)
      const data = await assignmentService.getAssignmentsForModule(module._id)
      setAssignments(data)
    } catch (error) {
      console.error('Failed to fetch assignments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAssignments()
  }, [module._id])

  const handleAssignmentCreated = () => {
    setIsModalOpen(false)
    fetchAssignments()
  }

  return (
    <>
      <div className="rounded-lg bg-gray-800 p-4 shadow">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{module.title}</h3>
            <p className="mt-1 text-sm text-gray-400">{module.description}</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-full bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
          >
            + Add
          </button>
        </div>

        {isLoading ? (
          <p className="mt-2 text-xs text-gray-500">Loading assignments...</p>
        ) : (
          <AssignmentList assignments={assignments} />
        )}
      </div>

      <Modal
        title={`New Assignment for: ${module.title}`}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <CreateAssignmentForm
          moduleId={module._id}
          onSuccess={handleAssignmentCreated}
        />
      </Modal>
    </>
  )
}

export default ModuleItem