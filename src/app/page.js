'use client'

import { useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import FileUpload from './components/FileUpload'
import ProcessButton from './components/ProcessButton'
import PDFViewer from './components/PDFViewer'

export default function Home() {
  const [templateFile, setTemplateFile] = useState(null)
  const [documentFiles, setDocumentFiles] = useState([])
  const [generatedPDF, setGeneratedPDF] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleTemplateUpload = async (file) => {
    try {
      const formData = new FormData()
      formData.append('template', file)
      
      const response = await fetch('/api/extract-template', {
        method: 'POST',
        body: formData,
      })
      
      if (response.ok) {
        setTemplateFile(file)
        toast.success('Template berhasil diupload dan diproses!', {
          duration: 3000,
          position: 'top-center',
          style: {
            background: 'rgba(34, 197, 94, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            color: '#16a34a'
          }
        })
      } else {
        throw new Error('Failed to process template')
      }
    } catch (error) {
      toast.error('Gagal memproses template')
    }
  }

  const handleDocumentUpload = (files) => {
    setDocumentFiles(files)
    toast.success(`${files.length} dokumen berhasil diupload!`)
  }

  const processDocuments = async () => {
    if (!templateFile || documentFiles.length === 0) return

    setIsProcessing(true)
    try {
      const formData = new FormData()
      documentFiles.forEach(file => {
        formData.append('documents', file)
      })

      const response = await fetch('/api/process-documents', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const { summary } = await response.json()
        
        // Generate PDF
        const pdfResponse = await fetch('/api/generate-pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ summary }),
        })

        if (pdfResponse.ok) {
          const blob = await pdfResponse.blob()
          const url = URL.createObjectURL(blob)
          setGeneratedPDF(url)
          toast.success('PDF berhasil dibuat!')
        }
      }
    } catch (error) {
      toast.error('Gagal memproses dokumen')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Toaster />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            PDF to LaTeX Converter
          </h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
            Upload template dan dokumen pemerintah untuk menghasilkan laporan PDF yang terstruktur menggunakan AI dan LaTeX
          </p>
        </div>

        {/* Glass Cards */}
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Template Upload Card */}
          <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white mr-3">
                1
              </span>
              Upload Template
            </h2>
            <FileUpload
              onFileUpload={handleTemplateUpload}
              acceptedTypes=".pdf"
              multiple={false}
              label="Upload template PDF yang akan dijadikan acuan struktur"
              uploaded={!!templateFile}
            />
          </div>

          {/* Document Upload Card */}
          <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white mr-3">
                2
              </span>
              Upload Dokumen Laporan
            </h2>
            <FileUpload
              onFileUpload={handleDocumentUpload}
              acceptedTypes=".pdf"
              multiple={true}
              label="Upload dokumen laporan pemerintah (bisa beberapa file sekaligus)"
              disabled={!templateFile}
              uploaded={documentFiles.length > 0}
            />
          </div>

          {/* Process Button */}
          <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white mr-3">
                3
              </span>
              Proses dengan AI
            </h2>
            <ProcessButton
              onProcess={processDocuments}
              disabled={!templateFile || documentFiles.length === 0}
              isProcessing={isProcessing}
            />
          </div>

          {/* PDF Viewer */}
          {generatedPDF && (
            <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <span className="bg-gradient-to-r from-green-400 to-blue-400 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white mr-3">
                  ✓
                </span>
                Hasil PDF
              </h2>
              <PDFViewer pdfUrl={generatedPDF} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}