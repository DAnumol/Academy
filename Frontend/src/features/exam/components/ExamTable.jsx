import { useState } from 'react'
import GenericDataTable from '@components/ui/GenericDataTable'
import GenericFormModal from '@components/ui/GenericFormModal'
import { useAuthStore } from '@/store/authStore'
import { useGenericCRUD } from '@hooks/useGenericCRUD'
import { examService } from '@/services/examService'
import { examTableConfig } from '@config/tableConfigs'
import { examFormConfig } from '@config/formConfigs'
 
const ExamTable = () => {
  const { user } = useAuthStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
 
  // Generic CRUD hooks
  const { useList, useCreate, useUpdate, useDelete } = useGenericCRUD({
    queryKey: 'users',
    service: {
      getAll: examService.getAll,
      create: examService.create,
      update: examService.update,
      delete: examService.delete
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
 
 const handleStatusToggle = async (exam) => {
    const newStatus = !exam.status
    await updateMutation.mutateAsync({ 
      id: exam.examId, 
      status: newStatus 
    })
    refetch()
  }
 
  const handleEdit = async (exam) => {
    try {
      // Fetch complete exam data for editing
      const examId = exam.examId || exam.id
      const response = await examService.getById(examId)
      const completeExamData = response.data || response
      setSelectedUser(completeExamData)
      setShowEditModal(true)
    } catch (error) {
      console.error('Error fetching exam data:', error)
      // Fallback to existing data if API call fails
      setSelectedUser(exam)
      setShowEditModal(true)
    }
  }
  const handleDelete = (userId) => deleteMutation.mutate(userId)
  const handleBulkDelete = (userIds) => {
    userIds.forEach(id => deleteMutation.mutate(id))
  }
 
  const handleFormSubmit = async (data) => {
    const examData = {
      ...data,
      
    }
   
    if (showEditModal && selectedUser) {
      const examId = selectedUser.examId || selectedUser.id
      await updateMutation.mutateAsync({ id: examId, ...examData })
    } else {
      await createMutation.mutateAsync(examData)
    }
  }
 
  const isStudent = user?.role === 'student'

  return (
    <>
      <GenericDataTable
        data={users}
        columns={examTableConfig.columns}
        title={examTableConfig.title}
        description={examTableConfig.description}
        isLoading={isLoading}
        error={error}
        onRefetch={refetch}
        onAdd={!isStudent ? handleAdd : undefined}
        onEdit={!isStudent ? handleEdit : undefined}
        onDelete={!isStudent ? handleDelete : undefined}
        onStatusToggle={!isStudent ? handleStatusToggle : undefined}
        onBulkDelete={!isStudent ? handleBulkDelete : undefined}
        searchFields={examTableConfig.searchFields}
        filterConfig={examTableConfig.filterConfig}
        statusField={examTableConfig.statusField}
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
        title={showEditModal ? 'Edit User' : examFormConfig.title}
        fields={examFormConfig.fields}
        initialData={showEditModal && selectedUser ? selectedUser : null}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
     
     
    </>
  )
}
 
export default ExamTable
 