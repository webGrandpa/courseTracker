// client/src/components/ModuleList.tsx
import React from 'react'
import ModuleItem from './ModuleItem' 

interface Module {
  _id: string
  title: string
  description: string
}

interface ModuleListProps {
  modules: Module[]
}

const ModuleList: React.FC<ModuleListProps> = ({ modules }) => {

  if (modules.length === 0) {
    return <p className="text-gray-400">No modules found for this course.</p>
  }

  return (
    <div className="mt-6 space-y-4">
      {modules.map((module) => (
        <ModuleItem key={module._id} module={module} />
      ))}
    </div>
  )
}

export default ModuleList