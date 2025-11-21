import { useState } from 'react'
import GenericDataTable from '@components/ui/GenericDataTable'
import GenericFormModal from '@components/ui/GenericFormModal'
import { useGenericCRUD } from '@hooks/useGenericCRUD'
import { usePermissions } from '@/hooks/usePermissions'
import { PERMISSIONS } from '@/config/rolePermissions'
import { classService } from '@/services/classService'
import { classTableConfig } from '@config/tableConfigs'
import { classFormConfig } from '@config/formConfigs'

const ClassTable = () => {
  const { can } = usePermissions()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  
  // Generic CRUD hooks
  const { useList, useCreate, useUpdate, useDelete } = useGenericCRUD({
    queryKey: 'classes',
    service: {
      getAll: classService.getAll,
      create: classService.create,
      update: classService.update,
      delete: classService.delete
    },
    messages: {
      create: 'Class created successfully!',
      update: 'Class updated successfully!',
      delete: 'Class deleted successfully!'
    }
  })
  
  const { data: result = {}, isLoading, error, refetch } = useList()
  const users = result.data || []
  const createMutation = useCreate()
  const updateMutation = useUpdate()
  const deleteMutation = useDelete()

  const handleAdd = () => {
    setSelectedUser(null)
    setShowAddModal(true)
  }
   const handleStatusToggle = async (classes) => {
    const newStatus = !classes.status
    await updateMutation.mutateAsync({ 
      id: classes.classId, 
      name: classes.name,
      // email: classes.email,
      // role: classes.role,
      status: newStatus 
    })
    refetch()
  }
  
  const handleDelete = (classes) => {
    const id = typeof classes === 'string' ? classes : (classes._id || classes.id)
    deleteMutation.mutate(id)
  }
 
  
  // const handleDelete = (userId) => deleteMutation.mutate(userId)
  const handleBulkDelete = (userIds) => {
    userIds.forEach(id => deleteMutation.mutate(id))
  }

 

  const handleFormSubmit = async (data) => {
    if (showEditModal && selectedUser) {
      const classId = selectedUser.classId || selectedUser.id
      await updateMutation.mutateAsync({ id: classId, ...data })
    } else {
      await createMutation.mutateAsync(data)
    }
  }
 const handleEdit = async (classes) => {
    try {
      const classId = classes.classId || classes.id
      const response = await classService.getById(classId)
      const completeClassData = response.data || response
      setSelectedUser(completeClassData)
      setShowEditModal(true)
    } catch (error) {
      console.error('Error fetching class data:', error)
      setSelectedUser(classes)
      setShowEditModal(true)
    }
  }

  const allowedActions = []
  if (can(PERMISSIONS.EDIT_CLASS)) allowedActions.push('edit', 'toggle')
  if (can(PERMISSIONS.DELETE_CLASS)) allowedActions.push('delete')

  return (
    <>
      <GenericDataTable
        data={users}
        columns={classTableConfig.columns}
        title={classTableConfig.title}
        description={classTableConfig.description}
        isLoading={isLoading}
        error={error}
        onRefetch={refetch}
        onAdd={can(PERMISSIONS.CREATE_CLASS) ? handleAdd : undefined}
        onEdit={can(PERMISSIONS.EDIT_CLASS) ? handleEdit : undefined}
        onDelete={can(PERMISSIONS.DELETE_CLASS) ? handleDelete : undefined}
        onBulkDelete={can(PERMISSIONS.DELETE_CLASS) ? handleBulkDelete : undefined}
        onStatusToggle={can(PERMISSIONS.EDIT_CLASS) ? handleStatusToggle : undefined}
        searchFields={classTableConfig.searchFields}
        filterConfig={classTableConfig.filterConfig}
        statusField={classTableConfig.statusField}
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
        title={showEditModal ? 'Edit User' : classFormConfig.title}
        fields={classFormConfig.fields}
        initialData={showEditModal && selectedUser ? selectedUser : null}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
      
     
    </>
  )
}

export default ClassTable