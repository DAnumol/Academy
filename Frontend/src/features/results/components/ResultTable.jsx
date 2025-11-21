import { useState } from 'react'
import GenericDataTable from '@components/ui/GenericDataTable'
import GenericFormModal from '@components/ui/GenericFormModal'

import { useGenericCRUD } from '@hooks/useGenericCRUD'
import { resultService } from '@/services/resultService'
import { resultTableConfig } from '@config/tableConfigs'
import { resultFormConfig } from '@config/formConfigs'

const ResultTable = () => {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  
  // Generic CRUD hooks
  const { useList, useCreate, useUpdate, useDelete } = useGenericCRUD({
    queryKey: 'users',
    service: {
      getAll: resultService.getAll,
      create: resultService.create,
      update: resultService.update,
      delete: resultService.delete
    },
    messages: {
      create: 'User created successfully!',
      update: 'User updated successfully!',
      delete: 'User deleted successfully!'
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
  
  const handleEdit = (user) => {
    setSelectedUser(user)
    setShowEditModal(true)
  }
  const handleDelete = (userId) => deleteMutation.mutate(userId)
  const handleBulkDelete = (userIds) => {
    userIds.forEach(id => deleteMutation.mutate(id))
  }

  const handleFormSubmit = async (data) => {
    if (showEditModal && selectedUser) {
      await updateMutation.mutateAsync({ id: selectedUser.resultId, ...data })
    } else {
      await createMutation.mutateAsync(data)
    }
  }
   const handleStatusToggle = async (result) => {
    const newStatus = !result.status
    await updateMutation.mutateAsync({ 
      id: result.resultId, 
      status: newStatus 
    })
    refetch()
  }

  return (
    <>
      <GenericDataTable
        data={users}
        columns={resultTableConfig.columns}
        title={resultTableConfig.title}
        description={resultTableConfig.description}
        isLoading={isLoading}
        error={error}
        onRefetch={refetch}
        onAdd={handleAdd}
        onEdit={handleEdit}
          onStatusToggle={handleStatusToggle}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        searchFields={resultTableConfig.searchFields}
        filterConfig={resultTableConfig.filterConfig}
        statusField={resultTableConfig.statusField}
           actions={['edit', 'toggle','delete']}
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
        title={showEditModal ? 'Edit User' : resultFormConfig.title}
        fields={resultFormConfig.fields}
        initialData={showEditModal && selectedUser ? selectedUser : null}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
      
     
    </>
  )
}

export default ResultTable