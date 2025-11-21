import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Users, Plus, Edit, Trash2, Check, X } from 'lucide-react'
import ResponsiveFormModal from '@components/ui/ResponsiveFormModal'
import withPermissions from '@components/hoc/withPermissions'

const RoleManagement = () => {
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'Super Admin',
      description: 'Full system access',
      users: 2,
      permissions: ['all'],
      color: 'red'
    },
    {
      id: 2,
      name: 'Admin',
      description: 'Administrative access',
      users: 5,
      permissions: ['users', 'settings', 'reports'],
      color: 'blue'
    },
    {
      id: 3,
      name: 'Manager',
      description: 'Team management',
      users: 12,
      permissions: ['users', 'tasks', 'reports'],
      color: 'green'
    },
    {
      id: 4,
      name: 'User',
      description: 'Basic user access',
      users: 156,
      permissions: ['tasks', 'profile'],
      color: 'gray'
    }
  ])

  const [showRoleModal, setShowRoleModal] = useState(false)
  const [editingRole, setEditingRole] = useState(null)

  const permissions = [
    { id: 'users', name: 'User Management', description: 'Create, edit, delete users' },
    { id: 'tasks', name: 'Task Management', description: 'Manage tasks and projects' },
    { id: 'reports', name: 'Reports', description: 'View and generate reports' },
    { id: 'settings', name: 'System Settings', description: 'Configure system settings' },
    { id: 'billing', name: 'Billing', description: 'Manage billing and subscriptions' },
    { id: 'analytics', name: 'Analytics', description: 'View analytics and insights' }
  ]

  const getColorClasses = (color) => {
    const colors = {
      red: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      green: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      gray: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
    return colors[color] || colors.gray
  }

  const RoleForm = ({ role, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      name: role?.name || '',
      description: role?.description || '',
      permissions: role?.permissions || [],
      color: role?.color || 'blue'
    })

    const handlePermissionToggle = (permissionId) => {
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.includes(permissionId)
          ? prev.permissions.filter(p => p !== permissionId)
          : [...prev.permissions, permissionId]
      }))
    }

    const handleSubmit = (e) => {
      e.preventDefault()
      onSave(formData)
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Role Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color
            </label>
            <div className="flex gap-2">
              {['red', 'blue', 'green', 'gray'].map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                  className={`w-8 h-8 rounded-full border-2 ${
                    formData.color === color ? 'border-gray-900 dark:border-gray-100' : 'border-transparent'
                  } ${getColorClasses(color).split(' ')[0]}`}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Permissions
            </label>
            <div className="space-y-3">
              {permissions.map(permission => (
                <div key={permission.id} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id={permission.id}
                    checked={formData.permissions.includes(permission.id)}
                    onChange={() => handlePermissionToggle(permission.id)}
                    className="mt-1"
                  />
                  <div>
                    <label htmlFor={permission.id} className="font-medium text-gray-900 dark:text-gray-100">
                      {permission.name}
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {permission.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 btn-primary"
          >
            {role ? 'Update Role' : 'Create Role'}
          </button>
        </div>
      </form>
    )
  }

  const handleSaveRole = (roleData) => {
    if (editingRole) {
      setRoles(prev => prev.map(role => 
        role.id === editingRole.id 
          ? { ...role, ...roleData }
          : role
      ))
    } else {
      setRoles(prev => [...prev, {
        id: Date.now(),
        users: 0,
        ...roleData
      }])
    }
    setShowRoleModal(false)
    setEditingRole(null)
  }

  const handleDeleteRole = (roleId) => {
    setRoles(prev => prev.filter(role => role.id !== roleId))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Role Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage user roles and permissions</p>
        </div>
        
        <button
          onClick={() => setShowRoleModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {roles.map((role, index) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-floating p-6 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(role.color)}`}>
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {role.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {role.users} users
                  </p>
                </div>
              </div>
              
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setEditingRole(role)
                    setShowRoleModal(true)
                  }}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                  <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => handleDeleteRole(role.id)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {role.description}
            </p>

            <div className="space-y-2">
              <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Permissions
              </h4>
              <div className="flex flex-wrap gap-1">
                {role.permissions.includes('all') ? (
                  <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 rounded text-xs">
                    All Access
                  </span>
                ) : (
                  role.permissions.map(permission => (
                    <span
                      key={permission}
                      className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded text-xs"
                    >
                      {permissions.find(p => p.id === permission)?.name || permission}
                    </span>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <ResponsiveFormModal
        isOpen={showRoleModal}
        onClose={() => {
          setShowRoleModal(false)
          setEditingRole(null)
        }}
        title={editingRole ? 'Edit Role' : 'Create New Role'}
      >
        <RoleForm
          role={editingRole}
          onSave={handleSaveRole}
          onCancel={() => {
            setShowRoleModal(false)
            setEditingRole(null)
          }}
        />
      </ResponsiveFormModal>
    </motion.div>
  )
}

export default withPermissions(RoleManagement, ['admin', 'super_admin'])