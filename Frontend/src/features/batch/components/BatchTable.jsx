import { useState } from 'react'
import GenericDataTable from '@components/ui/GenericDataTable'
import GenericFormModal from '@components/ui/GenericFormModal'
import { useGenericCRUD } from '@hooks/useGenericCRUD'
import { usePermissions } from '@/hooks/usePermissions'
import { PERMISSIONS } from '@/config/rolePermissions'
import { batchService } from '../../../services/batchService'
import { batchTableConfig } from '../../../config/tableConfigs'
import { batchFormConfig } from '../../../config/formConfigs'

const BatchTable = () => {
  const { can } = usePermissions()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState(null)
  
  // Generic CRUD hooks
  const { useList, useCreate, useUpdate, useDelete } = useGenericCRUD({
    queryKey: 'batch',
    service: {
      getAll: batchService.getAll,
      create: batchService.create,
      update: batchService.update,
      delete: batchService.delete
    },
    messages: {
      create: 'Batch details created successfully!',
      update: 'Batch details updated successfully!',
      delete: 'Batch details deleted successfully!'
    }
  })

  
    const { data: result = {}, isLoading, error, refetch } = useList()
  const batch = result.data || []
  const createMutation = useCreate()
  const updateMutation = useUpdate()
  const deleteMutation = useDelete()

  const handleAdd = () => {
    setSelectedBatch(null)
    setShowAddModal(true)
  }
  const handleEdit = async (batch) => {
    try {
      // Fetch complete batch data for editing
      const batchId = batch.batchId || batch.id
      const response = await batchService.getById(batchId)
      const completeBatchData = response.data || response
      setSelectedBatch(completeBatchData)
      setShowEditModal(true)
    } catch (error) {
      console.error('Error fetching batch data:', error)
      // Fallback to existing data if API call fails
      setSelectedBatch(batch)
      setShowEditModal(true)
    }
  }
 const handleStatusToggle = async (batch) => {
    const newStatus = !batch.status
    await updateMutation.mutateAsync({ 
      id: batch.batchId, 
      name: batch.name,
      email: batch.email,
      role: batch.role,
      status: newStatus 
    })
    refetch()
  }
  
  const handleDelete = (batch) => {
    const id = typeof batch === 'string' ? batch : (batch._id || batch.id)
    deleteMutation.mutate(id)
  }
  const handleBulkDelete = (batchIds) => {
    batchIds.forEach(id => deleteMutation.mutate(id))
  }

  const handleFormSubmit = async (data) => {
    if (showEditModal && selectedBatch) {
      const batchId = selectedBatch.batchId || selectedBatch.id
      await updateMutation.mutateAsync({ id: batchId, ...data })
    } else {
      await createMutation.mutateAsync(data)
    }
  }

  const allowedActions = []
  if (can(PERMISSIONS.EDIT_BATCH)) allowedActions.push('edit', 'toggle')
  if (can(PERMISSIONS.DELETE_BATCH)) allowedActions.push('delete')

  return (
    <>
      <GenericDataTable
        data={batch}
        columns={batchTableConfig.columns}
        title={batchTableConfig.title}
        description={batchTableConfig.description}
        isLoading={isLoading}
        error={error}
        onRefetch={refetch}
        onAdd={can(PERMISSIONS.CREATE_BATCH) ? handleAdd : undefined}
        onEdit={can(PERMISSIONS.EDIT_BATCH) ? handleEdit : undefined}
        onStatusToggle={can(PERMISSIONS.EDIT_BATCH) ? handleStatusToggle : undefined}
        onDelete={can(PERMISSIONS.DELETE_BATCH) ? handleDelete : undefined}
        onBulkDelete={can(PERMISSIONS.DELETE_BATCH) ? handleBulkDelete : undefined}
        searchFields={batchTableConfig.searchFields}
        filterConfig={batchTableConfig.filterConfig}
        statusField={batchTableConfig.statusField}
        actions={allowedActions}
      />
      
      {/* Add/Edit Modal */}
      <GenericFormModal
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false)
          setShowEditModal(false)
          setSelectedBatch(null)
        }}
        onSubmit={handleFormSubmit}
        title={showEditModal ? 'Edit Batch' : batchFormConfig.title}
        fields={showEditModal ? batchFormConfig.fields : batchFormConfig.fields.filter(f => f.name !== 'studentIds')}
        initialData={showEditModal && selectedBatch ? selectedBatch : null}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
      

    </>
  )
}

export default BatchTable