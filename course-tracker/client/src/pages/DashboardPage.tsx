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

  // Это "callback", который мы передаем в форму
  const handleCourseCreated = () => {
    setIsModalOpen(false) // 1. Закрываем модальное окно
    fetchCourses()      // 2. ЗАПРАШИВАЕМ КУРСЫ ЗАНОВО!
  }

  // ... (Логика 'if (isLoading)' остается без изменений)
  if (isLoading) {
    return <div className="p-8 text-white">Loading your courses...</div>
  }

  // --- "Рисуем" страницу ---
  return (
    // --- Минимальный Каркас (Tailwind) ---
    <div className="p-8">
      {/* --- Шапка --- */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">
          Your Courses
        </h1>
        {/* 🔻🔻🔻 НАША НОВАЯ КНОПКА 🔻🔻🔻 */}
        <button
          onClick={() => setIsModalOpen(true)} // "Включаем" модальное окно
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + New Course
        </button>
      </div>

      {/* --- Сетка Курсов --- */}
      {/* Если курсов нет, показываем сообщение */}
      {!isLoading && courses.length === 0 && (
        <div className="text-center text-gray-400">
          <p>You haven't created any courses yet.</p>
          <p>Click "+ New Course" to get started!</p>
        </div>
      )}

      {/* "Рисуем" сетку, если курсы есть */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          // 🔻🔻🔻 2. "ОБОРАЧИВАЕМ" КАРТОЧКУ В ССЫЛКУ 🔻🔻🔻
          <Link 
            key={course._id} 
            to={`/course/${course._id}`} // Динамический URL
          >
            {/* 3. Убираем key из div, т.к. он теперь на <Link> */}
            <div
              className="rounded-lg bg-gray-800 p-6 shadow-lg transition-transform hover:scale-105 hover:bg-gray-700" // Добавил hover:bg-gray-700
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

      {/* 🔻🔻🔻 НАШЕ МОДАЛЬНОЕ ОКНО 🔻🔻🔻 */}
      {/* Оно "рисуется" здесь, но "невидимо", пока isOpen=false */}
      <Modal 
        title="Create New Course"
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} // Передаем функцию закрытия
      >
        {/* Вставляем "начинку" (форму) */}
        <CreateCourseForm 
          onSuccess={handleCourseCreated} // Передаем "callback"
        />
      </Modal>

    </div>
  )
}

export default DashboardPage