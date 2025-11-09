// client/src/pages/DashboardPage.tsx
import { useState, useEffect } from 'react'
import courseService from '../services/courseService'
import Modal from '../components/Modal'
import CreateCourseForm from '../components/CreateCourseForm'
import { Link } from 'react-router-dom'

interface Course {
  _id: string;
  title: string;
  instructor: string;
  status: string;
}

const DashboardPage = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchCourses = async () => {
    try {
      setIsLoading(true)
      const data = await courseService.getCourses()
      setCourses(data)
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleCourseCreated = () => {
    setIsModalOpen(false)
    fetchCourses()
  }

  if (isLoading) {
    return <div className="p-8 text-white">Loading your courses...</div>
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">
          Your Courses
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + New Course
        </button>
      </div>

      {!isLoading && courses.length === 0 && (
        <div className="text-center text-gray-400">
          <p>You haven't created any courses yet.</p>
          <p>Click "+ New Course" to get started!</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
=          <Link 
            key={course._id} 
            to={`/course/${course._id}`}
          >
            <div
              className="rounded-lg bg-gray-800 p-6 shadow-lg transition-transform hover:scale-105 hover:bg-gray-700"
            >
              <h2 className="mb-2 text-xl font-bold text-white">
                {course.title}
              </h2>
              <p className="mb-4 text-sm text-gray-400">
                {course.instructor}
              </p>
              <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                {course.status}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <Modal 
        title="Create New Course"
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      >
        <CreateCourseForm 
          onSuccess={handleCourseCreated}
        />
      </Modal>

    </div>
  )
}

export default DashboardPage