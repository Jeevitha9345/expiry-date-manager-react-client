import React, { useState } from 'react'
import { AlertTriangle, Trash2, X } from 'lucide-react'

const DeleteConfirmModal = ({ isOpen, onClose, product, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  if (!isOpen || !product) return null

  const handleConfirm = async () => {
    setIsDeleting(true)
    setErrorMessage('')
    try {
      await onDelete(product._id)
      onClose()
    } catch (error) {
      setErrorMessage(error.message || 'Failed to delete product')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-scaleUp">
        
        {/* Header */}
        <div className="p-6 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shadow-inner">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-extrabold text-slate-900 mb-2">Delete Product</h3>
          <p className="text-sm text-slate-600 mb-4">
            Are you sure you want to delete <span className="font-bold text-slate-900">"{product.title}"</span>? This action cannot be undone.
          </p>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {errorMessage}
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl text-slate-700 font-semibold text-sm bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isDeleting}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-bold text-sm bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/30 transition-all disabled:opacity-60"
            >
              {isDeleting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default DeleteConfirmModal
