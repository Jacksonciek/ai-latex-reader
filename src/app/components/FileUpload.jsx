'use client'

import { useState } from 'react'
import { Upload, File, CheckCircle } from 'lucide-react'

const FileUpload = ({ onFileUpload, acceptedTypes, multiple, label, disabled, uploaded }) => {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState([])

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (disabled) return

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (disabled) return
    
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (fileList) => {
    const fileArray = Array.from(fileList)
    setFiles(fileArray)
    
    if (multiple) {
      onFileUpload(fileArray)
    } else {
      onFileUpload(fileArray[0])
    }
  }

  return (
    <div className="w-full">
      <p className="text-blue-200 mb-4">{label}</p>
      
      <div
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300
          ${disabled 
            ? 'border-gray-500 bg-gray-800/20 cursor-not-allowed' 
            : dragActive 
              ? 'border-blue-400 bg-blue-500/10' 
              : uploaded 
                ? 'border-green-400 bg-green-500/10'
                : 'border-blue-300 bg-blue-500/5 hover:bg-blue-500/10 cursor-pointer'
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && document.getElementById(`file-input-${label}`).click()}
      >
        <input
          id={`file-input-${label}`}
          type="file"
          multiple={multiple}
          accept={acceptedTypes}
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />
        
        <div className="space-y-4">
          {uploaded ? (
            <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
          ) : (
            <Upload className={`mx-auto h-12 w-12 ${disabled ? 'text-gray-500' : 'text-blue-400'}`} />
          )}
          
          <div>
            <p className={`text-lg font-medium ${disabled ? 'text-gray-400' : uploaded ? 'text-green-300' : 'text-blue-200'}`}>
              {uploaded 
                ? `${multiple ? files.length + ' file(s)' : 'File'} berhasil diupload`
                : disabled 
                  ? 'Upload template terlebih dahulu'
                  : 'Klik atau drag & drop file di sini'
              }
            </p>
            <p className={`text-sm ${disabled ? 'text-gray-500' : 'text-blue-300'}`}>
              {acceptedTypes.toUpperCase()} files only
            </p>
          </div>

          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-center space-x-2 text-sm text-blue-200">
                  <File className="h-4 w-4" />
                  <span>{file.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FileUpload