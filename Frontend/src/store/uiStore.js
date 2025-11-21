import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '@utils/constants'

export const useUIStore = create(
  persist(
    (set, get) => ({
      sidebarCollapsed: false,
      sidebarMobile: false,
      notifications: [],
      loading: false,
      
      toggleSidebar: () => {
        set(state => ({ sidebarCollapsed: !state.sidebarCollapsed }))
      },
      
      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed })
      },
      
      toggleMobileSidebar: () => {
        set(state => ({ sidebarMobile: !state.sidebarMobile }))
      },
      
      setMobileSidebar: (open) => {
        set({ sidebarMobile: open })
      },
      
      addNotification: (notification) => {
        const id = Date.now().toString()
        const newNotification = {
          id,
          timestamp: new Date().toISOString(),
          read: false,
          ...notification
        }
        
        set(state => ({
          notifications: [newNotification, ...state.notifications].slice(0, 50) // Keep only last 50
        }))
        
        return id
      },
      
      markNotificationRead: (id) => {
        set(state => ({
          notifications: state.notifications.map(notif =>
            notif.id === id ? { ...notif, read: true } : notif
          )
        }))
      },
      
      markAllNotificationsRead: () => {
        set(state => ({
          notifications: state.notifications.map(notif => ({ ...notif, read: true }))
        }))
      },
      
      removeNotification: (id) => {
        set(state => ({
          notifications: state.notifications.filter(notif => notif.id !== id)
        }))
      },
      
      clearAllNotifications: () => {
        set({ notifications: [] })
      },
      
      setLoading: (loading) => {
        set({ loading })
      },
      
      getUnreadCount: () => {
        return get().notifications.filter(notif => !notif.read).length
      }
    }),
    {
      name: STORAGE_KEYS.SIDEBAR_STATE,
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed
      })
    }
  )
)