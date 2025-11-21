import { useState } from 'react'
import GenericDataTable from '@components/ui/GenericDataTable'
import GenericFormModal from '@components/ui/GenericFormModal'
import { useGenericCRUD } from '@hooks/useGenericCRUD'
import { usePermissions } from '@/hooks/usePermissions'
import { PERMISSIONS } from '@/config/rolePermissions'
import { staffService } from '@/services/staffService'
import { staffTableConfig } from '@config/tableConfigs'
import { staffFormConfig } from '@config/formConfigs'

const StaffTable = () => {
  const { can } = usePermissions()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  
  // Generic CRUD hooks
  const { useList, useCreate, useUpdate, useDelete } = useGenericCRUD({
    queryKey: 'staffs',
    service: {
      getAll: staffService.getAll,
      create: staffService.create,
      update: staffService.update,
      delete: staffService.delete
    },
    messages: {
      create: 'Staff created successfully!',
      update: 'Staff updated successfully!',
      delete: 'Staff deleted successfully!'
    }
  })
  
  const { data: result = {}, isLoading, error, refetch } = useList()
  const staffs = result.data || []
  const createMutation = useCreate()
  const updateMutation = useUpdate()
  const deleteMutation = useDelete()

  const handleAdd = () => {
    setSelectedUser(null)
    setShowAddModal(true)
  }
   const handleStatusToggle = async (staff) => {
    const newStatus = !staff.status
    await updateMutation.mutateAsync({
      id: staff.staffId,
      name: staff.name,
      code: staff.code,
      status: newStatus
    })
    refetch()
  }
  const handleView = (staff) => {
    setSelectedUser(staff)
    setShowViewModal(true)
  }
  const handleEdit = async (staff) => {
    try {
      // Fetch complete staff data for editing
      const staffId = staff.staffId || staff.id
      const response = await staffService.getById(staffId)
      const completeStaffData = response.data || response
      setSelectedUser(completeStaffData)
      setShowEditModal(true)
    } catch (error) {
      console.error('Error fetching staff data:', error)
      // Fallback to existing data if API call fails
      setSelectedUser(staff)
      setShowEditModal(true)
    }
  }
  // const handleDelete = (staffId) => deleteMutation.mutate(staffId)

const handleDelete = (staff) => {
    // If user is a string, it's the userId directly
    const staffId = typeof staff === 'string' ? staff : (staff.staffId || staff.id)
    console.log('Delete userId:', staffId)
    deleteMutation.mutate(staffId)
  }

  const handleBulkDelete = (staffIds) => {
    staffIds.forEach(id => deleteMutation.mutate(id))
  }

  const handleFormSubmit = async (data) => {
    if (showEditModal && selectedUser) {
      await updateMutation.mutateAsync({ id: selectedUser.staffId || selectedUser.id, ...data })
    } else {
      await createMutation.mutateAsync(data)
    }
  }

  const allowedActions = []
  if (can(PERMISSIONS.EDIT_STAFF)) allowedActions.push('edit', 'toggle')
  if (can(PERMISSIONS.DELETE_STAFF)) allowedActions.push('delete')

  return (
    <>
      <GenericDataTable
        data={staffs}
        columns={staffTableConfig.columns}
        title={staffTableConfig.title}
        description={staffTableConfig.description}
        isLoading={isLoading}
        error={error}
        onRefetch={refetch}
        onAdd={can(PERMISSIONS.CREATE_STAFF) ? handleAdd : undefined}
        onEdit={can(PERMISSIONS.EDIT_STAFF) ? handleEdit : undefined}
        onStatusToggle={can(PERMISSIONS.EDIT_STAFF) ? handleStatusToggle : undefined}
        onDelete={can(PERMISSIONS.DELETE_STAFF) ? handleDelete : undefined}
        onBulkDelete={can(PERMISSIONS.DELETE_STAFF) ? handleBulkDelete : undefined}
        searchFields={staffTableConfig.searchFields}
        filterConfig={staffTableConfig.filterConfig}
        statusField={staffTableConfig.statusField}
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
        title={showEditModal ? 'Edit Staff' : staffFormConfig.title}
        fields={staffFormConfig.fields}
        initialData={showEditModal && selectedUser ? selectedUser : null}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
      
     
    </>
  )
}

export default StaffTable