import { useState } from 'react'
import GenericDataTable from '@components/ui/GenericDataTable'
import GenericFormModal from '@components/ui/GenericFormModal'
import { useAuthStore } from '@/store/authStore'
import { useGenericCRUD } from '@hooks/useGenericCRUD'
import { timetableService } from '@/services/timetableService'
import { timetableTableConfig } from '@config/tableConfigs'
import { timetableFormConfig } from '@config/formConfigs'

const TimeTable = () => {
  const { user } = useAuthStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  
  // Generic CRUD hooks
  const { useList, useCreate, useUpdate, useDelete } = useGenericCRUD({
    queryKey: 'timetables',
    service: {
      getAll: timetableService.getAll,
      create: timetableService.create,
      update: timetableService.update,
      delete: timetableService.delete
    },
    messages: {
      create: 'TimeTable created successfully!',
      update: 'TimeTable updated successfully!',
      delete: 'TimeTable deleted successfully!'
    }
  })
  
  const { data: result = {}, isLoading, error, refetch } = useList()
  const timetables = result.data || []
  const createMutation = useCreate()
  const updateMutation = useUpdate()
  const deleteMutation = useDelete()

  const handleAdd = () => {
    setSelectedUser(null)
    setShowAddModal(true)
  }
  const handleView = (staff) => {
    setSelectedUser(staff)
    setShowViewModal(true)
  }
  const handleEdit = async (timetable) => {
    try {
      // Fetch complete timetable data for editing
      const timetableId = timetable.timetableId || timetable.id
      const response = await timetableService.getById(timetableId)
      const completeTimetableData = response.data || response
      setSelectedUser(completeTimetableData)
      setShowEditModal(true)
    } catch (error) {
      console.error('Error fetching timetable data:', error)
      // Fallback to existing data if API call fails
      setSelectedUser(timetable)
      setShowEditModal(true)
    }
  }
  const handleDelete = (staffId) => deleteMutation.mutate(staffId)
  const handleBulkDelete = (staffIds) => {
    staffIds.forEach(id => deleteMutation.mutate(id))
  }

  const handleStatusToggle = async (timetable) => {
    const newStatus = !timetable.status
    const timetableId = timetable.timetableId || timetable.id
    await updateMutation.mutateAsync({
      id: timetableId,
      batchId: timetable.batchId,
      weekStartDate: timetable.weekStartDate,
      schedule: timetable.schedule || [],
      status: newStatus
    })
    refetch()
  }


  const handleFormSubmit = async (data) => {
    console.log('Form submit data:', data)
    console.log('Schedule in submit:', data.schedule)
    
    const submitData = {
      batchId: data.batchId,
      weekStartDate: data.weekStartDate,
      schedule: Array.isArray(data.schedule) ? data.schedule : [],
      status: data.status === 'true' || data.status === true
    }
    
    console.log('Processed submit data:', submitData)
    
    if (showEditModal && selectedUser) {
      const timetableId = selectedUser.timetableId || selectedUser.id
      await updateMutation.mutateAsync({ id: timetableId, ...submitData })
    } else {
      await createMutation.mutateAsync(submitData)
    }
  }

  const isStudent = user?.role === 'student'

  return (
    <>
      <GenericDataTable
        data={timetables}
        columns={timetableTableConfig.columns}
        title={timetableTableConfig.title}
        description={timetableTableConfig.description}
        isLoading={isLoading}
        error={error}
        onRefetch={refetch}
        onAdd={!isStudent ? handleAdd : undefined}
        onView={handleView}
        onEdit={!isStudent ? handleEdit : undefined}
        onDelete={!isStudent ? handleDelete : undefined}
        onStatusToggle={!isStudent ? handleStatusToggle : undefined}
        onBulkDelete={!isStudent ? handleBulkDelete : undefined}
        searchFields={timetableTableConfig.searchFields}
        filterConfig={timetableTableConfig.filterConfig}
        statusField={timetableTableConfig.statusField}
        actions={isStudent ? [] : ['edit', 'toggle', 'delete']}
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
        title={showEditModal ? 'Edit TimeTable' : timetableFormConfig.title}
        fields={timetableFormConfig.fields}
        initialData={showEditModal && selectedUser ? selectedUser : null}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
      
     
    </>
  )
}

export default TimeTable