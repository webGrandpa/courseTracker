// client/src/services/assignmentService.ts
import api from './api'

const getAssignmentsForModule = async (moduleId: string) => {
  const response = await api.get(`/modules/${moduleId}/assignments`)
  return response.data
}


const assignmentService = {
  getAssignmentsForModule,
}

export default assignmentService