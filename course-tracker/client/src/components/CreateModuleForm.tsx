// client/src/components/CreateModuleForm.tsx
import React from 'react'
import { useForm } from 'react-hook-form'
import moduleService from '../services/moduleService'

interface CreateModuleFormProps {
  courseId: string 
  onSuccess: () => void
}

type FormData = {
  title: string
  description: string
}

const CreateModuleForm: React.FC<CreateModuleFormProps> = ({ courseId, onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    try {
      await moduleService.createModule({
        ...data,
        courseId: courseId,
      })
      onSuccess() 
    } catch (error) {
      console.error('Failed to create module:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Title */}
      <div className="mb-4">
        <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-300">
          Module Title
        </label>
        <input
          id="title"
          {...register('title', { required: 'Title is required' })}
          className="w-full rounded-md border border-gray-600 bg-gray-700 p-2.5 text-white"
        />
        {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>}
      </div>

      {/* Description (Optional) */}
      <div className="mb-4">
        <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-300">
          Description (Optional)
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={3}
          className="w-full rounded-md border border-gray-600 bg-gray-700 p-2.5 text-white"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 p-2.5 text-white hover:bg-blue-700"
      >
        Create Module
      </button>
    </form>
  )
}

export default CreateModuleForm