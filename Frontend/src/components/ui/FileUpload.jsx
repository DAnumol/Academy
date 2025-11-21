import { useState, useRef } from 'react'
import { Upload, X, File, Image } from 'lucide-react'
import { useFileUpload } from '../../hooks/useFileUpload'

import { Button } from './Button'

export const FileUpload = ({ 
  multiple = false, 
  onUploadComplete, 
  onError,
  className = '' 
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState({})
  const fileInputRef = useRef(null)
  
  const { uploading, progress, uploadFile, uploadMultiple, validateFile, createPreview } = useFileUpload()


  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files)
    handleFiles(selectedFiles)
  }

  const handleFiles = async (newFiles) => {
    const validFiles = []
    
    for (const file of newFiles) {
      const validation = validateFile(file)
      if (validation.isValid) {
        validFiles.push(file)
        const preview = await createPreview(file)
        if (preview) {
          setPreviews(prev => ({ ...prev, [file.name]: preview }))
        }
      } else {
        onError?.(validation.errors.join(', '))
      }
    }

    const newFileList = multiple ? [...files, ...validFiles] : validFiles
    setFiles(newFileList)
    
    // Immediately pass the file object to the form
    if (validFiles.length > 0) {
      const fileToPass = multiple ? newFileList : validFiles[0]
      console.log('FileUpload: Passing file to form:', fileToPass)
      console.log('File details:', {
        name: fileToPass.name,
        size: fileToPass.size,
        type: fileToPass.type
      })
      onUploadComplete?.(fileToPass)
    }
  }

  const removeFile = (fileName) => {
    setFiles(prev => prev.filter(f => f.name !== fileName))
    setPreviews(prev => {
      const newPreviews = { ...prev }
      delete newPreviews[fileName]
      return newPreviews
    })
  }

  const handleUpload = async () => {
    try {
      if (multiple) {
        const results = await uploadMultiple(files)
        onUploadComplete?.(results)
      } else {
        const result = await uploadFile(files[0])
        onUploadComplete?.(result)
      }
      setFiles([])
      setPreviews({})
    } catch (error) {
      onError?.(error.message)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Drag and drop files here, or click to select
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Maximum file size: 10 MB
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Allowed types: PDF, DOC, Images
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
      />

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">
            Selected Files ({files.length})
          </h4>
          {files.map((file) => (
            <div key={file.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                {previews[file.name] ? (
                  <img src={previews[file.name]} alt="" className="w-10 h-10 object-cover rounded" />
                ) : file.type.startsWith('image/') ? (
                  <Image className="w-10 h-10 text-gray-400" />
                ) : (
                  <File className="w-10 h-10 text-gray-400" />
                )}
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{file.name}</p>
                  <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(file.name)}
                disabled={uploading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setFiles([])
                setPreviews({})
                onUploadComplete?.(null)
              }}
              disabled={uploading}
            >
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}