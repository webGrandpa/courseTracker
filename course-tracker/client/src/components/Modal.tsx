// client/src/components/Modal.tsx
import type { ReactNode } from 'react'
interface ModalProps {
  isOpen: boolean
  onClose: () => void 
  title: string
  children: ReactNode 
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-50 w-full max-w-lg rounded-lg bg-gray-800 p-6 shadow-lg"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            &times;
          </button>
        </div>

        <div>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal