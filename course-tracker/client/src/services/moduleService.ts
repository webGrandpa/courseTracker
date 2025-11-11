// client/src/services/moduleService.ts
import api from './api'

// ტიპი
interface CreateModuleData {
  title: string
  description?: string
  courseId: string 
}

const createModule = async (moduleData: CreateModuleData) => {
  const response = await api.post('/modules', moduleData)
  return response.data
}


const moduleService = {
  createModule,
}

export default moduleService