import { useState } from 'react'
import GenericDataTable from '@components/ui/GenericDataTable'
import GenericFormModal from '@components/ui/GenericFormModal'
import ViewTaskModal from './ViewTaskModal'
import { useGenericCRUD } from '@hooks/useGenericCRUD'
import { taskService } from '@/services/taskService'
import { taskTableConfig } from '@config/tableConfigs'
import { taskFormConfig } from '@config/formConfigs'

const TaskTable = () => {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  
  // Generic CRUD hooks
  const { useList, useCreate, useUpdate, useDelete } = useGenericCRUD({
    queryKey: 'tasks',
    service: {
      getAll: taskService.getAll,
      create: taskService.create,
      update: taskService.update,
      delete: taskService.delete
    },
    messages: {
      create: 'Task created successfully!',
      update: 'Task updated successfully!',
      delete: 'Task deleted successfully!'
    }
  })
  
  const { data: result = {}, isLoading, error, refetch } = useList()
  const tasks = result.data || []
  const createMutation = useCreate()
  const updateMutation = useUpdate()
  const deleteMutation = useDelete()

  const handleAdd = () => {
    setSelectedTask(null)
    setShowAddModal(true)
  }
  const handleView = (task) => {
    setSelectedTask(task)
    setShowViewModal(true)
  }
  const handleEdit = (task) => {
    setSelectedTask(task)
    setShowEditModal(true)
  }
  const handleDelete = (taskId) => deleteMutation.mutate(taskId)
  const handleBulkDelete = (taskIds) => {
    taskIds.forEach(id => deleteMutation.mutate(id))
  }

  const handleFormSubmit = async (data) => {
    if (showEditModal && selectedTask) {
      await updateMutation.mutateAsync({ id: selectedTask.id, ...data })
    } else {
      await createMutation.mutateAsync(data)
    }
  }

  return (
    <>
      <GenericDataTable
        data={tasks}
        columns={taskTableConfig.columns}
        title={taskTableConfig.title}
        description={taskTableConfig.description}
        isLoading={isLoading}
        error={error}
        onRefetch={refetch}
        onAdd={handleAdd}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        searchFields={taskTableConfig.searchFields}
        filterConfig={taskTableConfig.filterConfig}
        statusField={taskTableConfig.statusField}
      />
      
      {/* Add/Edit Modal */}
      <GenericFormModal
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false)
          setShowEditModal(false)
          setSelectedTask(null)
        }}
        onSubmit={handleFormSubmit}
        title={showEditModal ? 'Edit Task' : taskFormConfig.title}
        fields={taskFormConfig.fields}
        initialData={showEditModal && selectedTask ? selectedTask : null}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
      
      {/* View Modal */}
      <ViewTaskModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        task={selectedTask}
        onEdit={(task) => {
          setShowViewModal(false)
          handleEdit(task)
        }}
      />
    </>
  )
}

export default TaskTable