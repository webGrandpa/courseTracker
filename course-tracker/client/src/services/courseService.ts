// client/src/services/courseService.ts
import api from './api'

interface CreateCourseData {
  title: string
  instructor?: string
  description?: string
}

const getCourses = async () => {
  const response = await api.get('/courses')
  return response.data
}


const createCourse = async (courseData: CreateCourseData) => {
  const response = await api.post('/courses', courseData)
  return response.data
}

const getCourseById = async (courseId: string) => {
  const response = await api.get(`/courses/${courseId}`)
  return response.data
}

const getModulesForCourse = async (courseId: string) => {
  const response = await api.get(`/courses/${courseId}/modules`)
  return response.data
}

const courseService = {
  getCourses,
  createCourse,
  getCourseById,       
  getModulesForCourse, 
}

export default courseService