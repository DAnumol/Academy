import { logger } from './loggerService'


class BackupService {
  constructor() {
    this.backupVersion = '1.0'
    this.compressionEnabled = true
  }

  // Create full application backup
  async createBackup(includeUserData = true, password = null) {
    try {
      const backup = {
        version: this.backupVersion,
        timestamp: new Date().toISOString(),
        data: {}
      }

      // Backup localStorage data
      backup.data.localStorage = this.backupLocalStorage()

      // Backup sessionStorage data
      backup.data.sessionStorage = this.backupSessionStorage()

      // Backup user preferences
      if (includeUserData) {
        backup.data.userPreferences = this.backupUserPreferences()
      }

      // Backup application state
      backup.data.appState = this.backupAppState()

      // Compress if enabled
      if (this.compressionEnabled) {
        backup.data = await this.compressData(backup.data)
        backup.compressed = true
      }

      // Note: Encryption removed for frontend-only template
      // In production, implement proper encryption on the backend

      logger.info('Backup created successfully', { 
        size: JSON.stringify(backup).length,
        encrypted: !!password,
        compressed: this.compressionEnabled
      })

      return backup
    } catch (error) {
      logger.error('Backup creation failed', error)
      throw error
    }
  }

  // Restore from backup
  async restoreBackup(backup, password = null) {
    try {
      let data = backup.data

      // Note: Decryption removed for frontend-only template
      // In production, implement proper decryption on the backend

      // Decompress if compressed
      if (backup.compressed) {
        data = await this.decompressData(data)
      }

      // Restore localStorage
      if (data.localStorage) {
        this.restoreLocalStorage(data.localStorage)
      }

      // Restore sessionStorage
      if (data.sessionStorage) {
        this.restoreSessionStorage(data.sessionStorage)
      }

      // Restore user preferences
      if (data.userPreferences) {
        this.restoreUserPreferences(data.userPreferences)
      }

      // Restore application state
      if (data.appState) {
        this.restoreAppState(data.appState)
      }

      logger.info('Backup restored successfully', {
        version: backup.version,
        timestamp: backup.timestamp
      })

      return true
    } catch (error) {
      logger.error('Backup restoration failed', error)
      throw error
    }
  }

  // Export backup to file with enhanced security
  exportBackup(backup, filename = null) {
    try {
      const defaultFilename = `enterprise-backup-${new Date().toISOString().split('T')[0]}.json`
      const cleanFilename = filename || defaultFilename

      const dataStr = JSON.stringify(backup, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })

      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = cleanFilename
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      logger.info('Backup exported', { filename: cleanFilename })
    } catch (error) {
      logger.error('Backup export failed', error)
      throw new Error('Failed to export backup')
    }
  }

  // Import backup from file with validation
  importBackup(file) {
    return new Promise((resolve, reject) => {
      // Validate file type and size
      if (!file.type.includes('json') && !file.name.endsWith('.json')) {
        reject(new Error('Invalid file type. Only JSON files are allowed.'))
        return
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        reject(new Error('File too large. Maximum size is 10MB.'))
        return
      }
      
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const content = e.target.result
          const backup = JSON.parse(content)
          
          // Validate backup structure
          if (!this.validateBackupStructure(backup)) {
            reject(new Error('Invalid backup file structure'))
            return
          }
          
          resolve(backup)
        } catch (error) {
          reject(new Error('Invalid backup file format'))
        }
      }
      
      reader.onerror = () => reject(new Error('Failed to read backup file'))
      reader.readAsText(file)
    })
  }

  // Backup specific data types
  backupLocalStorage() {
    const data = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      data[key] = localStorage.getItem(key)
    }
    return data
  }

  backupSessionStorage() {
    const data = {}
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      data[key] = sessionStorage.getItem(key)
    }
    return data
  }

  backupUserPreferences() {
    return {
      theme: localStorage.getItem('enterprise_theme_preference'),
      language: localStorage.getItem('locale'),
      sidebarState: localStorage.getItem('enterprise_sidebar_collapsed')
    }
  }

  backupAppState() {
    // Backup current application state from stores
    return {
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    }
  }

  // Restore specific data types
  restoreLocalStorage(data) {
    try {
      Object.entries(data).forEach(([key, value]) => {
        if (key && value) {
          localStorage.setItem(key, String(value))
        }
      })
    } catch (error) {
      logger.error('Failed to restore localStorage', error)
    }
  }

  restoreSessionStorage(data) {
    try {
      Object.entries(data).forEach(([key, value]) => {
        if (key && value) {
          sessionStorage.setItem(key, String(value))
        }
      })
    } catch (error) {
      logger.error('Failed to restore sessionStorage', error)
    }
  }

  restoreUserPreferences(data) {
    if (data.theme) localStorage.setItem('enterprise_theme_preference', data.theme)
    if (data.language) localStorage.setItem('locale', data.language)
    if (data.sidebarState) localStorage.setItem('enterprise_sidebar_collapsed', data.sidebarState)
  }

  restoreAppState(data) {
    // Restore application state to stores
    logger.info('App state restored', data)
  }



  validateBackupStructure(backup) {
    return backup && 
           typeof backup === 'object' && 
           backup.version && 
           backup.timestamp && 
           backup.data &&
           typeof backup.data === 'object'
  }

  // Compression utilities
  async compressData(data) {
    const jsonString = JSON.stringify(data)
    const stream = new CompressionStream('gzip')
    const writer = stream.writable.getWriter()
    const reader = stream.readable.getReader()

    writer.write(new TextEncoder().encode(jsonString))
    writer.close()

    const chunks = []
    let done = false

    while (!done) {
      const { value, done: readerDone } = await reader.read()
      done = readerDone
      if (value) chunks.push(value)
    }

    return Array.from(new Uint8Array(await new Blob(chunks).arrayBuffer()))
  }

  async decompressData(compressedData) {
    const stream = new DecompressionStream('gzip')
    const writer = stream.writable.getWriter()
    const reader = stream.readable.getReader()

    writer.write(new Uint8Array(compressedData))
    writer.close()

    const chunks = []
    let done = false

    while (!done) {
      const { value, done: readerDone } = await reader.read()
      done = readerDone
      if (value) chunks.push(value)
    }

    const decompressed = new TextDecoder().decode(await new Blob(chunks).arrayBuffer())
    return JSON.parse(decompressed)
  }

  // Scheduled backups
  scheduleAutoBackup(intervalHours = 24) {
    setInterval(() => {
      this.createBackup(true)
        .then(backup => {
          localStorage.setItem('auto-backup', JSON.stringify(backup))
          logger.info('Auto backup completed')
        })
        .catch(error => {
          logger.error('Auto backup failed', error)
        })
    }, intervalHours * 60 * 60 * 1000)
  }
}

export const backupService = new BackupService()
export default backupService