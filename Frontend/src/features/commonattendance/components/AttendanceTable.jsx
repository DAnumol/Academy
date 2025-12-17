import { useState } from 'react'
import GenericDataTable from '@components/ui/GenericDataTable'
import GenericFormModal from '@components/ui/GenericFormModal'
import { useGenericCRUD } from '@hooks/useGenericCRUD'
import { usePermissions } from '@/hooks/usePermissions'
import { PERMISSIONS } from '@/config/rolePermissions'
import { commonAttendanceService } from '../../../services/commonAttendanceService'
import { commonAttendanceTableConfig } from '../../../config/tableConfigs'
import { commonAttendanceFormConfig } from '../../../config/formConfigs'



const AttendanceTable = () => {
  const { can } = usePermissions()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedAttendance, setSelectedAttendance] = useState(null)
  
  // Generic CRUD hooks
  const { useList, useCreate, useUpdate, useDelete } = useGenericCRUD({
    queryKey: 'commonAttendance',
    service: {
      getAll: commonAttendanceService.getAll,
      create: commonAttendanceService.create,
      update: commonAttendanceService.update,
      delete: commonAttendanceService.delete
    },
    messages: {
      create: 'Batch details created successfully!',
      update: 'Batch details updated successfully!',
      delete: 'Batch details deleted successfully!'
    }
  })
  
  const { data: result = {}, isLoading, error, refetch } = useList()
  const attendance = result.data || []
  const createMutation = useCreate()
  const updateMutation = useUpdate()
  const deleteMutation = useDelete()

  const handleAdd = () => {
    setSelectedAttendance(null)
    setShowAddModal(true)
  }
  const handleView = (attendance) => {
    setSelectedAttendance(attendance)
    setShowViewModal(true)
  }
  const handleEdit = (attendance) => {
    setSelectedAttendance(attendance)
    setShowEditModal(true)
  }
  const handleDelete = (attendanceId) => deleteMutation.mutate(attendanceId)
  const handleBulkDelete = (attendanceIds) => {
    attendanceIds.forEach(id => deleteMutation.mutate(id))
  }

  const handleFormSubmit = async (data) => {
    if (showEditModal && selectedAttendance) {
      await updateMutation.mutateAsync({ id: selectedAttendance.id, ...data })
    } else {
      await createMutation.mutateAsync(data)
    }
  }

  const allowedActions = []
  if (can(PERMISSIONS.EDIT_ATTENDANCE)) allowedActions.push('edit')

  return (
    <>
      <GenericDataTable
        data={attendance}
        columns={commonAttendanceTableConfig.columns}
        title={commonAttendanceTableConfig.title}
        description={commonAttendanceTableConfig.description}
        isLoading={isLoading}
        error={error}
        onRefetch={refetch}
        onAdd={can(PERMISSIONS.MARK_ATTENDANCE) ? handleAdd : undefined}
        onView={handleView}
        onEdit={can(PERMISSIONS.EDIT_ATTENDANCE) ? handleEdit : undefined}
        onDelete={can(PERMISSIONS.EDIT_ATTENDANCE) ? handleDelete : undefined}
        onBulkDelete={can(PERMISSIONS.EDIT_ATTENDANCE) ? handleBulkDelete : undefined}
        searchFields={commonAttendanceTableConfig.searchFields}
        filterConfig={commonAttendanceTableConfig.filterConfig}
        statusField={commonAttendanceTableConfig.statusField}
        actions={allowedActions}
      />
      
      {/* Add/Edit Modal */}
      <GenericFormModal
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false)
          setShowEditModal(false)
          setSelectedAttendance(null)
        }}
        onSubmit={handleFormSubmit}
        title={showEditModal ? 'Edit Common Attendance' : commonAttendanceFormConfig.title}
        fields={commonAttendanceFormConfig.fields}
        initialData={showEditModal && selectedAttendance ? selectedAttendance : null}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
      
      {/* View Modal */}
      {/* <ViewUserModal
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

export default AttendanceTable