const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Mock data store
let mockTasks = [
  { id: 1, title: 'Update user dashboard', description: 'Redesign the user dashboard with new components', status: 'In Progress', priority: 'High', assignee: 'John Doe', dueDate: '2024-01-15', createdAt: '2024-01-01', tags: ['UI/UX', 'Frontend'] },
  { id: 2, title: 'Fix authentication bug', description: 'Resolve login issues with social authentication', status: 'Todo', priority: 'High', assignee: 'Jane Smith', dueDate: '2024-01-10', createdAt: '2024-01-02', tags: ['Bug', 'Backend'] },
  { id: 3, title: 'Implement dark mode', description: 'Add dark mode support across all pages', status: 'Completed', priority: 'Medium', assignee: 'Mike Johnson', dueDate: '2024-01-05', createdAt: '2023-12-28', tags: ['Feature', 'UI/UX'] },
  { id: 4, title: 'Database optimization', description: 'Optimize database queries for better performance', status: 'In Progress', priority: 'High', assignee: 'Sarah Wilson', dueDate: '2024-01-20', createdAt: '2024-01-03', tags: ['Performance', 'Backend'] },
  { id: 5, title: 'Mobile responsiveness', description: 'Ensure all pages work properly on mobile devices', status: 'Todo', priority: 'Low', assignee: 'Alex Brown', dueDate: '2024-01-25', createdAt: '2024-01-04', tags: ['Mobile', 'Frontend'] }
]

export const taskService = {
  getAll: async (filters = {}) => {
    await delay(600)
    let filtered = [...mockTasks]
    
    if (filters.search) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description.toLowerCase().includes(filters.search.toLowerCase())
      )
    }
    
    return { data: filtered, total: filtered.length }
  },

  create: async (taskData) => {
    await delay(800)
    const newTask = {
      id: Date.now(),
      ...taskData,
      status: 'Todo',
      tags: taskData.tags || [],
      createdAt: new Date().toISOString().split('T')[0]
    }
    mockTasks.push(newTask)
    return newTask
  },

  update: async (id, taskData) => {
    await delay(500)
    const index = mockTasks.findIndex(task => task.id === id)
    if (index !== -1) {
      mockTasks[index] = { ...mockTasks[index], ...taskData, updatedAt: new Date().toISOString() }
      return mockTasks[index]
    }
    throw new Error('Task not found')
  },

  delete: async (id) => {
    await delay(400)
    const index = mockTasks.findIndex(task => task.id === id)
    if (index !== -1) {
      mockTasks.splice(index, 1)
      return { success: true, id }
    }
    throw new Error('Task not found')
  },

  // Legacy methods for backward compatibility
  getTasks: function(filters) { return this.getAll(filters).then(result => result.data) },
  createTask: function(data) { return this.create(data) },
  updateTask: function(id, data) { return this.update(id, data) },
  deleteTask: function(id) { return this.delete(id) }
}