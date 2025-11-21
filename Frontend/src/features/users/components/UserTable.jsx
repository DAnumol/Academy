import { useState } from 'react'
import GenericDataTable from '@components/ui/GenericDataTable'
import GenericFormModal from '@components/ui/GenericFormModal'
import { useGenericCRUD } from '@hooks/useGenericCRUD'
import { usePermissions } from '@/hooks/usePermissions'
import { PERMISSIONS } from '@/config/rolePermissions'
import { userService } from '@/services/userService'
import { userTableConfig } from '@config/tableConfigs'
import { userFormConfig } from '@config/formConfigs'

const UserTable = () => {
  const { can } = usePermissions()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  
  // Generic CRUD hooks
  const { useList, useCreate, useUpdate, useDelete } = useGenericCRUD({
    queryKey: 'users',
    service: {
      getAll: userService.getAll,
      create: userService.create,
      update: userService.update,
      delete: userService.delete
    },
    messages: {
      create: 'User created successfully!',
      update: 'User updated successfully!',
      delete: 'User deleted successfully!'
    }
  })
  
  const { data: result = {}, isLoading, error, refetch } = useList()
  const users = result.data?.items || []
  const createMutation = useCreate()
  const updateMutation = useUpdate()
  const deleteMutation = useDelete()

  const handleAdd = () => {
    setSelectedUser(null)
    setShowAddModal(true)
  }
  const handleView = (user) => {
    setSelectedUser(user)
    setShowViewModal(true)
  }
  const handleEdit = async (user) => {
    try {
      // Fetch complete user data for editing
      const userId = user.userId || user.id
      const response = await userService.getById(userId)
      const completeUserData = response.data || response
      setSelectedUser(completeUserData)
      setShowEditModal(true)
    } catch (error) {
      console.error('Error fetching user data:', error)
      // Fallback to existing data if API call fails
      setSelectedUser(user)
      setShowEditModal(true)
    }
  }
  const handleStatusToggle = async (user) => {
    const newStatus = !user.status
    await updateMutation.mutateAsync({ 
      id: user.userId, 
      name: user.name,
      email: user.email,
      role: user.role,
      status: newStatus 
    })
    refetch()
  }
  
   const handleDelete = (user) => {
    // If user is a string, it's the userId directly
    const userId = typeof user === 'string' ? user : (user.userId || user.id)
    console.log('Delete userId:', userId)
    deleteMutation.mutate(userId)
  }
  
  const handleBulkDelete = (userIds) => {
    userIds.forEach(id => deleteMutation.mutate(id))
  }

  const handleFormSubmit = async (data) => {
    if (showEditModal && selectedUser) {
      const userId = selectedUser.userId || selectedUser.id
      await updateMutation.mutateAsync({ id: userId, ...data })
    } else {
      await createMutation.mutateAsync(data)
    }
    // Refetch data to show new/updated user
    refetch()
  }

  const allowedActions = []
  if (can(PERMISSIONS.EDIT_USER)) allowedActions.push('edit', 'toggle')
  if (can(PERMISSIONS.DELETE_USER)) allowedActions.push('delete')

  return (
    <>
      <GenericDataTable
        data={users}
        columns={userTableConfig.columns}
        title={userTableConfig.title}
        description={userTableConfig.description}
        isLoading={isLoading}
        error={error}
        onRefetch={refetch}
        onAdd={can(PERMISSIONS.CREATE_USER) ? handleAdd : undefined}
        onView={handleView}
        onEdit={can(PERMISSIONS.EDIT_USER) ? handleEdit : undefined}
        onStatusToggle={can(PERMISSIONS.EDIT_USER) ? handleStatusToggle : undefined}
        onDelete={can(PERMISSIONS.DELETE_USER) ? handleDelete : undefined}
        onBulkDelete={can(PERMISSIONS.DELETE_USER) ? handleBulkDelete : undefined}
        searchFields={userTableConfig.searchFields}
        filterConfig={userTableConfig.filterConfig}
        statusField={userTableConfig.statusField}
        actions={allowedActions}
      />
      
      {/* Add/Edit Modal */}
      <GenericFormModal
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false)
          setShowEditModal(false)
          setSelectedUser(null)
        }}
        onSubmit={handleFormSubmit}
        title={showEditModal ? 'Edit User' : userFormConfig.title}
        fields={userFormConfig.fields}
        initialData={showEditModal && selectedUser ? selectedUser : null}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
      
      {/* View Modal
      <ViewUserModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        user={selectedUser}
        onEdit={(user) => {
          setShowViewModal(false)
          handleEdit(user)
        }}
      /> */}
    </>
  )
}

export default UserTable