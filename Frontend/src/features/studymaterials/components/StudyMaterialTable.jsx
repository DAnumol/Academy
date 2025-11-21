import { useState } from 'react'
import GenericDataTable from '@components/ui/GenericDataTable'
import GenericFormModal from '@components/ui/GenericFormModal'
import { useAuthStore } from '@/store/authStore'
import { useGenericCRUD } from '@hooks/useGenericCRUD'
import { studymaterialService } from '@/services/studymaterialService'
import { studymaterialTableConfig } from '@config/tableConfigs'
import { studymaterialFormConfig } from '@config/formConfigs'

const StudyMaterialTable = () => {
  const { user } = useAuthStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  
  // Generic CRUD hooks
  const { useList, useCreate, useUpdate, useDelete } = useGenericCRUD({
    queryKey: 'studymaterials',
    service: {
      getAll: studymaterialService.getAll,
      create: studymaterialService.create,
      update: studymaterialService.update,
      delete: studymaterialService.delete
    },
    messages: {
      create: 'Studymaterial created successfully!',
      update: 'Studymaterial updated successfully!',
      delete: 'Studymaterial deleted successfully!'
    }
  })
  
  const { data: result = {}, isLoading, error, refetch } = useList()
  const studymaterials = result.data || []
  const createMutation = useCreate()
  const updateMutation = useUpdate()
  const deleteMutation = useDelete()

  const handleAdd = () => {
    setSelectedUser(null)
    setShowAddModal(true)
  }
  const handleView = (studymaterial) => {
    setSelectedUser(studymaterial)
    setShowViewModal(true)
  }
  const handleEdit = async (studymaterial) => {
    try {
      // Fetch complete material data for editing
      const response = await studymaterialService.getById(studymaterial.materialId)
      const completeMaterialData = response.data || response
      setSelectedUser(completeMaterialData)
      setShowEditModal(true)
    } catch (error) {
      console.error('Error fetching material data:', error)
      // Fallback to existing data if API call fails
      setSelectedUser(studymaterial)
      setShowEditModal(true)
    }
  }
  const handleDelete = (staffId) => deleteMutation.mutate(staffId)
  const handleBulkDelete = (staffIds) => {
    staffIds.forEach(id => deleteMutation.mutate(id))
  }

   const handleStatusToggle = async (material) => {
    const newStatus = !material.status
    await updateMutation.mutateAsync({
      id: material.materialId,
     
      status: newStatus
    })
    refetch()
  }
  const handleFormSubmit = async (data) => {
    if (showEditModal && selectedUser) {
      await updateMutation.mutateAsync({ id: selectedUser.materialId, ...data })
    } else {
      await createMutation.mutateAsync(data)
    }
  }

  const handlePrint = (material) => {
    if (material.fileUrl) {
      const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000'
      const fileUrl = material.fileUrl.startsWith('http') ? material.fileUrl : `${baseUrl}${material.fileUrl.startsWith('/') ? '' : '/'}${material.fileUrl}`
      window.open(fileUrl, '_blank')
    }
  }

  const isStudent = user?.role === 'student'

  return (
    <>
      <GenericDataTable
        data={studymaterials}
        columns={studymaterialTableConfig.columns}
        title={studymaterialTableConfig.title}
        description={studymaterialTableConfig.description}
        isLoading={isLoading}
        error={error}
        onRefetch={refetch}
        onAdd={!isStudent ? handleAdd : undefined}
        onView={handleView}
        onEdit={!isStudent ? handleEdit : undefined}
        onStatusToggle={!isStudent ? handleStatusToggle : undefined}
        onDelete={!isStudent ? handleDelete : undefined}
        onBulkDelete={!isStudent ? handleBulkDelete : undefined}
        onPrint={handlePrint}
        searchFields={studymaterialTableConfig.searchFields}
        filterConfig={studymaterialTableConfig.filterConfig}
        statusField={studymaterialTableConfig.statusField}
        actions={isStudent ? ['print'] : ['edit', 'toggle', 'delete', 'print']}
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
        title={showEditModal ? 'Edit StudyMaterial' : studymaterialFormConfig.title}
        fields={studymaterialFormConfig.fields}
        initialData={showEditModal && selectedUser ? selectedUser : null}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
      
     
    </>
  )
}

export default StudyMaterialTable