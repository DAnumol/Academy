import { Wifi, WifiOff, RefreshCw, AlertCircle } from 'lucide-react'
import { useOffline } from '../../hooks/useOffline'


export const OfflineIndicator = () => {
  const { isOnline, syncStatus } = useOffline()


  if (isOnline && syncStatus.pendingSync === 0) {
    return null
  }

  return (
    <div className={`fixed top-4 right-4 z-50 p-3 rounded-lg shadow-lg max-w-sm ${
      isOnline 
        ? 'bg-blue-500 text-white' 
        : 'bg-red-500 text-white'
    }`}>
      <div className="flex items-center space-x-2">
        {isOnline ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" />
            <div>
              <p className="font-medium">Syncing {syncStatus.pendingSync} items...</p>
            </div>
          </>
        ) : (
          <>
            <WifiOff className="w-5 h-5" />
            <div>
              <p className="font-medium">You're offline</p>
              {syncStatus.pendingSync > 0 && (
                <p className="text-sm opacity-90">
                  {syncStatus.pendingSync} items pending sync
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}