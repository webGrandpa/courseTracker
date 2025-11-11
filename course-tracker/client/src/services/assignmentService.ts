// client/src/services/assignmentService.ts
import api from './api'

// ტიპი
interface CreateAssignmentData {
  title: string
  status?: string
  dueDate?: string | undefined
  moduleId: string
}


const getAssignmentsForModule = async (moduleId: string) => {
  const response = await api.get(`/modules/${moduleId}/assignments`)
  return response.data
}

const createAssignment = async (assignmentData: CreateAssignmentData) => {
  const response = await api.post('/assignments', assignmentData)
  return response.data
}

const assignmentService = {
  getAssignmentsForModule,
  createAssignment,
}

export default assignmentService