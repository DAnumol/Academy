import { create } from 'zustand'

export const useCacheStore = create((set, get) => ({
  cache: new Map(),
  
  getCache: (key) => {
    const cached = get().cache.get(key)
    if (!cached) return null
    
    if (Date.now() > cached.expiresAt) {
      get().removeCache(key)
      return null
    }
    
    return cached
  },
  
  setCache: (key, data, ttl = 5 * 60 * 1000) => {
    const expiresAt = Date.now() + ttl
    set((state) => {
      const newCache = new Map(state.cache)
      newCache.set(key, { data, expiresAt, expired: false })
      return { cache: newCache }
    })
  },
  
  removeCache: (key) => {
    set((state) => {
      const newCache = new Map(state.cache)
      newCache.delete(key)
      return { cache: newCache }
    })
  },
  
  clearCache: () => {
    set({ cache: new Map() })
  },
  
  getCacheSize: () => {
    return get().cache.size
  },
  
  cleanExpiredCache: () => {
    const now = Date.now()
    set((state) => {
      const newCache = new Map()
      state.cache.forEach((value, key) => {
        if (now <= value.expiresAt) {
          newCache.set(key, value)
        }
      })
      return { cache: newCache }
    })
  }
}))

// Auto-cleanup expired cache every 5 minutes
setInterval(() => {
  useCacheStore.getState().cleanExpiredCache()
}, 5 * 60 * 1000)