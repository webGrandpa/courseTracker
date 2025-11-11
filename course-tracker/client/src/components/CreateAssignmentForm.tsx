// client/src/components/CreateAssignmentForm.tsx
import React from 'react'
import { useForm } from 'react-hook-form'
import assignmentService from '../services/assignmentService'

interface CreateAssignmentFormProps {
  moduleId: string 
  onSuccess: () => void 
}

type FormData = {
  title: string
  dueDate: string 
}

const CreateAssignmentForm: React.FC<CreateAssignmentFormProps> = ({ moduleId, onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    try {
      await assignmentService.createAssignment({
        title: data.title,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
        moduleId: moduleId,
      })
      onSuccess() 
    } catch (error) {
      console.error('Failed to create assignment:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-300">
          Assignment Title
        </label>
        <input
          id="title"
          {...register('title', { required: 'Title is required' })}
          className="w-full rounded-md border border-gray-600 bg-gray-700 p-2.5 text-white"
        />
        {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="dueDate" className="mb-2 block text-sm font-medium text-gray-300">
          Due Date (Optional)
        </label>
        <input
          id="dueDate"
          type="date" 
          {...register('dueDate')}
          className="w-full rounded-md border border-gray-600 bg-gray-700 p-2.5 text-white"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 p-2.5 text-white hover:bg-blue-700"
      >
        Create Assignment
      </button>
    </form>
  )
}

export default CreateAssignmentForm