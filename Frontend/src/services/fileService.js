import { apiClient } from './apiClient'

class FileService {
  constructor() {
    this.maxFileSize = parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 10485760 // 10MB
    this.allowedTypes = import.meta.env.VITE_ALLOWED_FILE_TYPES?.split(',') || ['.pdf', '.doc', '.docx', '.jpg', '.png']
    this.uploadEndpoint = import.meta.env.VITE_UPLOAD_ENDPOINT || '/api/upload'
  }

  validateFile(file) {
    const errors = []
    
    if (file.size > this.maxFileSize) {
      errors.push(`File size exceeds ${this.maxFileSize / 1024 / 1024}MB limit`)
    }

    const extension = '.' + file.name.split('.').pop().toLowerCase()
    if (!this.allowedTypes.includes(extension)) {
      errors.push(`File type ${extension} not allowed`)
    }

    return { isValid: errors.length === 0, errors }
  }

  async uploadFile(file, onProgress) {
    const validation = this.validateFile(file)
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '))
    }

    const formData = new FormData()
    formData.append('file', file)

    return apiClient.post(this.uploadEndpoint, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress?.(progress)
      }
    })
  }

  async uploadMultiple(files, onProgress) {
    const results = []
    let completed = 0

    for (const file of files) {
      try {
        const result = await this.uploadFile(file, (fileProgress) => {
          const totalProgress = Math.round(((completed + fileProgress / 100) / files.length) * 100)
          onProgress?.(totalProgress)
        })
        results.push({ file: file.name, success: true, data: result.data })
        completed++
      } catch (error) {
        results.push({ file: file.name, success: false, error: error.message })
        completed++
      }
    }

    return results
  }

  async downloadFile(fileId, filename) {
    const response = await apiClient.get(`/api/files/${fileId}/download`, {
      responseType: 'blob'
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  }

  createFilePreview(file) {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.readAsDataURL(file)
      } else {
        resolve(null)
      }
    })
  }
}

export const fileService = new FileService()