import { useEffect, useState } from 'react'
import { offlineService } from '../services/offlineService'

export const useOffline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [syncStatus, setSyncStatus] = useState(offlineService.getStatus())

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setSyncStatus(offlineService.getStatus())
    }

    const handleOffline = () => {
      setIsOnline(false)
      setSyncStatus(offlineService.getStatus())
    }

    const handleSyncSuccess = () => {
      setSyncStatus(offlineService.getStatus())
    }

    const handleSyncError = () => {
      setSyncStatus(offlineService.getStatus())
    }

    offlineService.on('online', handleOnline)
    offlineService.on('offline', handleOffline)
    offlineService.on('sync-success', handleSyncSuccess)
    offlineService.on('sync-error', handleSyncError)

    return () => {
      offlineService.off('online', handleOnline)
      offlineService.off('offline', handleOffline)
      offlineService.off('sync-success', handleSyncSuccess)
      offlineService.off('sync-error', handleSyncError)
    }
  }, [])

  const cacheData = (key, data, ttl) => {
    offlineService.cacheData(key, data, ttl)
  }

  const getCachedData = (key) => {
    return offlineService.getCachedData(key)
  }

  const queueRequest = (request) => {
    offlineService.queueRequest(request)
  }

  return {
    isOnline,
    syncStatus,
    cacheData,
    getCachedData,
    queueRequest
  }
}