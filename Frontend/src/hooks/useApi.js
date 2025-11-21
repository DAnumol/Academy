import { useState } from 'react'
import { apiClient } from '@/services/apiClient'
import toast from 'react-hot-toast'

export const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = async (method, url, data = null, options = {}) => {
    setLoading(true)
    setError(null)

    try {
      let response
      switch (method.toLowerCase()) {
        case 'get':
          response = await apiClient.get(url, options)
          break
        case 'post':
          response = await apiClient.post(url, data, options)
          break
        case 'put':
          response = await apiClient.put(url, data, options)
          break
        case 'patch':
          response = await apiClient.patch(url, data, options)
          break
        case 'delete':
          response = await apiClient.delete(url, options)
          break
        default:
          throw new Error(`Unsupported method: ${method}`)
      }
      return response
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const get = (url, options) => request('get', url, null, options)
  const post = (url, data, options) => request('post', url, data, options)
  const put = (url, data, options) => request('put', url, data, options)
  const patch = (url, data, options) => request('patch', url, data, options)
  const del = (url, options) => request('delete', url, null, options)

  return {
    loading,
    error,
    request,
    get,
    post,
    put,
    patch,
    delete: del
  }
}