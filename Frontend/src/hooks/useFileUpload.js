import { useState } from 'react'
import { fileService } from '../services/fileService'

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)

  const uploadFile = async (file) => {
    setUploading(true)
    setError(null)
    setProgress(0)

    try {
      const result = await fileService.uploadFile(file, setProgress)
      setUploading(false)
      return result.data
    } catch (err) {
      setError(err.message)
      setUploading(false)
      throw err
    }
  }

  const uploadMultiple = async (files) => {
    setUploading(true)
    setError(null)
    setProgress(0)

    try {
      const results = await fileService.uploadMultiple(files, setProgress)
      setUploading(false)
      return results
    } catch (err) {
      setError(err.message)
      setUploading(false)
      throw err
    }
  }

  const validateFile = (file) => {
    return fileService.validateFile(file)
  }

  const createPreview = async (file) => {
    return fileService.createFilePreview(file)
  }

  const reset = () => {
    setUploading(false)
    setProgress(0)
    setError(null)
  }

  return {
    uploading,
    progress,
    error,
    uploadFile,
    uploadMultiple,
    validateFile,
    createPreview,
    reset
  }
}