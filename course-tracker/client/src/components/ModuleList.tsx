// client/src/components/ModuleList.tsx
import React from 'react'
import ModuleItem from './ModuleItem' // <-- 1. Импорт "умного" ребенка

// Временный тип
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
    // --- Минимальный Каркас (Tailwind) ---
    <div className="mt-6 space-y-4">
      {/* 2. "Бежим" по модулям */}
      {modules.map((module) => (
        // 3. "Рождаем" "умный" компонент, передавая ему 1 модуль
        <ModuleItem key={module._id} module={module} />
      ))}
    </div>
  )
}

export default ModuleList