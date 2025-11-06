// client/src/components/Modal.tsx
import type { ReactNode } from 'react'
interface ModalProps {
  isOpen: boolean
  onClose: () => void // Функция, чтобы закрыть себя
  title: string
  children: ReactNode // "Начинка" модального окна (наша форма)
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // Если 'isOpen' = false, не "рисуем" ничего (null)
  if (!isOpen) return null

  return (
    // --- Минимальный Каркас (Tailwind) ---
    // 1. "Затемнение" (Overlay)
    <div 
      onClick={onClose} // Закрытие по клику на темный фон
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50"
    >
      {/* 2. "Коробка" Модального Окна */}
      <div
        onClick={(e) => e.stopPropagation()} // Предотвращаем закрытие по клику на саму "коробку"
        className="relative z-50 w-full max-w-lg rounded-lg bg-gray-800 p-6 shadow-lg"
      >
        {/* 3. Шапка с заголовком и кнопкой "X" */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            &times; {/* Это "X" */}
          </button>
        </div>

        {/* 4. "Начинка" (наша форма) */}
        <div>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal