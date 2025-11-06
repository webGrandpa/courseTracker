// client/src/pages/CourseDetailPage.tsx
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import courseService from '../services/courseService'
import ModuleList from '../components/ModuleList' // <-- 1. Импорт

// Временные типы
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
  // "Читаем" :id из URL
  const { id } = useParams<{ id: string }>()

  // "Коробки" для наших данных
  const [course, setCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // useEffect для загрузки данных при "рождении" компонента
  useEffect(() => {
    // Убедимся, что ID точно есть
    if (!id) return

    const fetchData = async () => {
      try {
        // 2. 🔻🔻🔻 НАШ ПАРАЛЛЕЛЬНЫЙ ЗАПРОС 🔻🔻🔻
        const [courseData, modulesData] = await Promise.all([
          courseService.getCourseById(id),
          courseService.getModulesForCourse(id),
        ])

        // 3. "Раскладываем" данные по "коробкам"
        setCourse(courseData)
        setModules(modulesData)

      } catch (error) {
        console.error('Failed to fetch course details:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id]) // <-- "Крючок" сработает заново, если ID в URL изменится

  // --- "Рисование" (Render) ---

  // Показываем "загрузчик"
  if (isLoading) {
    return <div className="p-8 text-white">Loading course details...</div>
  }

  // Если курс не найден
  if (!course) {
    return <div className="p-8 text-white">Course not found.</div>
  }

  // Если все ОК - "рисуем" страницу
  return (
    // --- Минимальный Каркас (Tailwind) ---
    <div className="p-8 text-white">
      {/* 1. Шапка Курса */}
      <span className="text-sm text-gray-400">
        {course.instructor}
      </span>
      <h1 className="mt-1 text-4xl font-bold text-white">
        {course.title}
      </h1>

      {/* 2. Раздел Модулей */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-white">
          Modules
        </h2>
        {/* 3. Используем наш компонент "Каркас" */}
        <ModuleList modules={modules} />
      </div>
    </div>
  )
}

export default CourseDetailPage