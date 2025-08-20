'use client'

import { Brain, Loader2 } from 'lucide-react'

const ProcessButton = ({ onProcess, disabled, isProcessing }) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={onProcess}
        disabled={disabled || isProcessing}
        className={`
          px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center space-x-3
          ${disabled || isProcessing
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 hover:scale-105 shadow-2xl hover:shadow-purple-500/25'
          }
        `}
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Memproses dengan AI...</span>
          </>
        ) : (
          <>
            <Brain className="h-6 w-6" />
            <span>Proses dengan AI</span>
          </>
        )}
      </button>
      
      <p className="text-blue-200 text-sm text-center max-w-md">
        AI akan menganalisis dokumen dan menyesuaikannya dengan template LaTeX untuk menghasilkan laporan yang terstruktur
      </p>
    </div>
  )
}

export default ProcessButton