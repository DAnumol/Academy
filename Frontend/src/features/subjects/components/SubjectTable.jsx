import { useState } from 'react'
import GenericDataTable from '@components/ui/GenericDataTable'
import GenericFormModal from '@components/ui/GenericFormModal'
import { useGenericCRUD } from '@hooks/useGenericCRUD'
import { usePermissions } from '@/hooks/usePermissions'
import { PERMISSIONS } from '@/config/rolePermissions'
import { subjectService } from '@/services/subjectService'
import { subjectTableConfig } from '@config/tableConfigs'
import { subjectFormConfig } from '@config/formConfigs'

const SubjectTable = () => {
  const { can } = usePermissions()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Generic CRUD hooks
  const { useList, useCreate, useUpdate, useDelete } = useGenericCRUD({
    queryKey: 'subjects',
    service: {
      getAll: subjectService.getAll,
      create: subjectService.create,
      update: subjectService.update,
      delete: subjectService.delete
    },
    messages: {
      create: 'Subject created successfully!',
      update: 'Subject updated successfully!',
      delete: 'Subject deleted successfully!'
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

  const handleEdit = async (subject) => {
    try {
      // Fetch complete subject data for editing
      const subjectId = subject.subjectId || subject.id
      const response = await subjectService.getById(subjectId)
      const completeSubjectData = response.data || response
      setSelectedUser(completeSubjectData)
      setShowEditModal(true)
    } catch (error) {
      console.error('Error fetching subject data:', error)
      // Fallback to existing data if API call fails
      setSelectedUser(subject)
      setShowEditModal(true)
    }
  }
  const handleDelete = (subjectId) => deleteMutation.mutate(subjectId)

  const handleBulkDelete = (userIds) => {
    userIds.forEach(id => deleteMutation.mutate(id))
  }
  const handleStatusToggle = async (subject) => {
    const newStatus = !subject.status
    await updateMutation.mutateAsync({
      id: subject.subjectId,
      name: subject.name,
      code: subject.code,
      status: newStatus
    })
    refetch()
  }


  // const handleFormSubmit = async (data) => {
  //   if (showEditModal && selectedUser) {
  //     await updateMutation.mutateAsync({ id: selectedUser.id, ...data })
  //   } else {
  //     await createMutation.mutateAsync(data)
  //   }
  // }


  const handleFormSubmit = async (data) => {
    if (showEditModal && selectedUser) {
      const subjectId = selectedUser.subjectId || selectedUser.id
      await updateMutation.mutateAsync({ id: subjectId, ...data })
    } else {
      await createMutation.mutateAsync(data)
    }
    // Refetch data to show new/updated user
    refetch()
  }
  const allowedActions = []
  if (can(PERMISSIONS.EDIT_SUBJECT)) allowedActions.push('edit', 'toggle')
  if (can(PERMISSIONS.DELETE_SUBJECT)) allowedActions.push('delete')

  return (
    <>
      <GenericDataTable
        data={users}
        columns={subjectTableConfig.columns}
        title={subjectTableConfig.title}
        description={subjectTableConfig.description}
        isLoading={isLoading}
        error={error}
        onRefetch={refetch}
        onAdd={can(PERMISSIONS.CREATE_SUBJECT) ? handleAdd : undefined}
        onEdit={can(PERMISSIONS.EDIT_SUBJECT) ? handleEdit : undefined}
        onStatusToggle={can(PERMISSIONS.EDIT_SUBJECT) ? handleStatusToggle : undefined}
        onDelete={can(PERMISSIONS.DELETE_SUBJECT) ? handleDelete : undefined}
        onBulkDelete={can(PERMISSIONS.DELETE_SUBJECT) ? handleBulkDelete : undefined}
        searchFields={subjectTableConfig.searchFields}
        
        filterConfig={subjectTableConfig.filterConfig}
        statusField={subjectTableConfig.statusField}
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
        title={showEditModal ? 'Edit Subject' : subjectFormConfig.title}
        fields={showEditModal ? subjectFormConfig.fields : subjectFormConfig.fields.filter(f => f.name !== 'staffIds')}
        initialData={showEditModal && selectedUser ? selectedUser : null}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />


    </>
  )
}

export default SubjectTable