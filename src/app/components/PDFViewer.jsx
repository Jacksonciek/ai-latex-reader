'use client'

import { Download, Eye } from 'lucide-react'

const PDFViewer = ({ pdfUrl }) => {
  const downloadPDF = () => {
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = 'generated-report.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={downloadPDF}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 flex items-center space-x-2 hover:scale-105"
        >
          <Download className="h-5 w-5" />
          <span>Download PDF</span>
        </button>
        
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center space-x-2 hover:scale-105"
        >
          <Eye className="h-5 w-5" />
          <span>Lihat PDF</span>
        </a>
      </div>

      <div className="w-full h-96 bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
        <iframe
          src={pdfUrl}
          className="w-full h-full rounded-2xl"
          title="Generated PDF"
        />
      </div>
    </div>
  )
}

export default PDFViewer