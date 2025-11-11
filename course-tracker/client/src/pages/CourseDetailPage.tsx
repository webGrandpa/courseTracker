// client/src/pages/CourseDetailPage.tsx
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import courseService from '../services/courseService'
import ModuleList from '../components/ModuleList'
import Modal from '../components/Modal'
import CreateModuleForm from '../components/CreateModuleForm'

interface Course {
  _id: string
  title: string
  instructor: string
}
interface Module {
  _id: string
  title: string
  description: string
}

const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>()

  const [course, setCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchModules = async (courseId: string) => {
    try {
      const modulesData = await courseService.getModulesForCourse(courseId)
      setModules(modulesData)
    } catch (error) {
      console.error('Failed to fetch modules:', error)
    }
  }

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      setIsLoading(true)
      try {
        const courseData = await courseService.getCourseById(id)
        setCourse(courseData)

        await fetchModules(id)
      } catch (error) {
        console.error('Failed to fetch course details:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleModuleCreated = () => {
    setIsModalOpen(false)
    if (id) {
      fetchModules(id)
    }
  }


  if (isLoading) {
    return <div className="p-8 text-white">Loading course details...</div>
  }

  if (!course) {
    return <div className="p-8 text-white">Course not found.</div>
  }

  return (
    <div className="p-8 text-white">
      <span className="text-sm text-gray-400">{course.instructor}</span>
      <h1 className="mt-1 text-4xl font-bold text-white">{course.title}</h1>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Modules</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            + New Module
          </button>
        </div>

        <ModuleList modules={modules} />
      </div>

      <Modal
        title="Create New Module"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <CreateModuleForm
          courseId={course._id}
          onSuccess={handleModuleCreated}
        />
      </Modal>
    </div>
  )
}

export default CourseDetailPage