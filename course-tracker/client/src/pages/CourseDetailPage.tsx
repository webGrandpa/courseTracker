// client/src/pages/CourseDetailPage.tsx
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import courseService from '../services/courseService'
import ModuleList from '../components/ModuleList'

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

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        const [courseData, modulesData] = await Promise.all([
          courseService.getCourseById(id),
          courseService.getModulesForCourse(id),
        ])

        setCourse(courseData)
        setModules(modulesData)

      } catch (error) {
        console.error('Failed to fetch course details:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (isLoading) {
    return <div className="p-8 text-white">Loading course details...</div>
  }

  if (!course) {
    return <div className="p-8 text-white">Course not found.</div>
  }

  return (
    <div className="p-8 text-white">
      <span className="text-sm text-gray-400">
        {course.instructor}
      </span>
      <h1 className="mt-1 text-4xl font-bold text-white">
        {course.title}
      </h1>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-white">
          Modules
        </h2>
        <ModuleList modules={modules} />
      </div>
    </div>
  )
}

export default CourseDetailPage