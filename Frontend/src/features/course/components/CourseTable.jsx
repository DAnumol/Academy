import { useState } from 'react'
import GenericDataTable from '@components/ui/GenericDataTable'
import GenericFormModal from '@components/ui/GenericFormModal'
import { useGenericCRUD } from '@hooks/useGenericCRUD'
import { usePermissions } from '@/hooks/usePermissions'
import { PERMISSIONS } from '@/config/rolePermissions'
import { courseService } from '@/services/courseService'
import { courseTableConfig } from '@config/tableConfigs'
import { courseFormConfig } from '@config/formConfigs'

const CourseTable = () => {
  const { can } = usePermissions()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  
  // Generic CRUD hooks
  const { useList, useCreate, useUpdate, useDelete } = useGenericCRUD({
    queryKey: 'courses',
    service: {
      getAll: courseService.getAll,
      create: courseService.create,
      update: courseService.update,
      delete: courseService.delete
    },
    messages: {
      create: 'Course created successfully!',
      update: 'Course updated successfully!',
      delete: 'Course deleted successfully!'
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
  
  const handleEdit = async (course) => {
    try {
      // Fetch complete course data for editing
      const courseId = course.courseId || course.id
      const response = await courseService.getById(courseId)
      const completeCourseData = response.data || response
      setSelectedUser(completeCourseData)
      setShowEditModal(true)
    } catch (error) {
      console.error('Error fetching course data:', error)
      // Fallback to existing data if API call fails
      setSelectedUser(course)
      setShowEditModal(true)
    }
  }
  const handleStatusToggle = async (course) => {
    const newStatus = !course.status
    await updateMutation.mutateAsync({ 
      id: course.courseId, 
      name: course.name,
      email: course.email,
      role: course.role,
      status: newStatus 
    })
    refetch()
  }
  
  const handleDelete = (course) => {
    const courseId = typeof course === 'string' ? course : (course.courseId || course.id)
    deleteMutation.mutate(courseId)
  }
  const handleBulkDelete = (userIds) => {
    userIds.forEach(id => deleteMutation.mutate(id))
  }

  const handleFormSubmit = async (data) => {
    if (showEditModal && selectedUser) {
      const courseId = selectedUser.courseId || selectedUser.id
      await updateMutation.mutateAsync({ id: courseId, ...data })
    } else {
      await createMutation.mutateAsync(data)
    }
  }

  const allowedActions = []
  if (can(PERMISSIONS.EDIT_COURSE)) allowedActions.push('edit', 'toggle')
  if (can(PERMISSIONS.DELETE_COURSE)) allowedActions.push('delete')

  return (
    <>
      <GenericDataTable
        data={users}
        columns={courseTableConfig.columns}
        title={courseTableConfig.title}
        description={courseTableConfig.description}
        isLoading={isLoading}
        error={error}
        onRefetch={refetch}
        onAdd={can(PERMISSIONS.CREATE_COURSE) ? handleAdd : undefined}
        onEdit={can(PERMISSIONS.EDIT_COURSE) ? handleEdit : undefined}
        onStatusToggle={can(PERMISSIONS.EDIT_COURSE) ? handleStatusToggle : undefined}
        onDelete={can(PERMISSIONS.DELETE_COURSE) ? handleDelete : undefined}
        onBulkDelete={can(PERMISSIONS.DELETE_COURSE) ? handleBulkDelete : undefined}
        searchFields={courseTableConfig.searchFields}
        filterConfig={courseTableConfig.filterConfig}
        statusField={courseTableConfig.statusField}
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
        title={showEditModal ? 'Edit User' : courseFormConfig.title}
        fields={showEditModal ? courseFormConfig.fields : courseFormConfig.fields.filter(f => f.name !== 'subjectIds')}
        initialData={showEditModal && selectedUser ? selectedUser : null}
        isLoading={createMutation.isPending || updateMutation.isPending}

      />
      
     
    </>
  )
}

export default CourseTable