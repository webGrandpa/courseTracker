// client/src/components/CreateCourseForm.tsx
import React from 'react'
import { useForm } from 'react-hook-form'
import courseService from '../services/courseService'

interface CreateCourseFormProps {
  // Эта функция будет "дернута" после успеха,
  // чтобы родитель (Dashboard) обновил список
  onSuccess: () => void 
}

type FormData = {
  title: string
  instructor: string
  description: string
}

const CreateCourseForm: React.FC<CreateCourseFormProps> = ({ onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    try {
      // "Звоним" в сервис
      await courseService.createCourse(data)
      // "Дергаем" родителя: "Успех! Обновляй список!"
      onSuccess() 
    } catch (error) {
      console.error('Failed to create course:', error)
    }
  }

  return (
    // --- Минимальный Каркас Формы (Tailwind) ---
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Title */}
      <div className="mb-4">
        <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-300">
          Course Title
        </label>
        <input
          id="title"
          {...register('title', { required: 'Title is required' })}
          className="w-full rounded-md border border-gray-600 bg-gray-700 p-2.5 text-white"
        />
        {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>}
      </div>

      {/* Instructor (Optional) */}
      <div className="mb-4">
        <label htmlFor="instructor" className="mb-2 block text-sm font-medium text-gray-300">
          Instructor (Optional)
        </label>
        <input
          id="instructor"
          {...register('instructor')}
          className="w-full rounded-md border border-gray-600 bg-gray-700 p-2.5 text-white"
        />
      </div>

      {/* (Мы пропустим 'description' для краткости) */}

      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 p-2.5 text-white hover:bg-blue-700"
      >
        Create Course
      </button>
    </form>
  )
}

export default CreateCourseForm