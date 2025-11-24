import { useState } from 'react'
import GenericDataTable from '@components/ui/GenericDataTable'
import GenericFormModal from '@components/ui/GenericFormModal'
import { useGenericCRUD } from '@hooks/useGenericCRUD'
import { usePermissions } from '@/hooks/usePermissions'
import { PERMISSIONS } from '@/config/rolePermissions'
import { questionpaperService } from '@/services/questionpaperService'
import { questionpaperTableConfig } from '@config/tableConfigs'
import { questionPaperFormConfig } from '@config/formConfigs'

const QuestionPaperTable = () => {
  const { can } = usePermissions()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  
  // Generic CRUD hooks
  const { useList, useCreate, useUpdate, useDelete } = useGenericCRUD({
    queryKey: 'questionpapers',
    service: {
      getAll: questionpaperService.getAll,
      create: questionpaperService.create,
      update: questionpaperService.update,
      delete: questionpaperService.delete
    },
    messages: {
      create: 'Questionpaper created successfully!',
      update: 'Questionpaper  updated successfully!',
      delete: 'Questionpaper  deleted successfully!'
    }
  })
  
  const { data: result = {}, isLoading, error, refetch } = useList()
  const questionpapers = result.data || []
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
  const handleEdit = async (questionpaper) => {
    try {
      // Fetch complete question paper data including questionSet
      const response = await questionpaperService.getById(questionpaper.qpId)
      const completeData = response.data || response
      setSelectedUser(completeData)
      setShowEditModal(true)
    } catch (error) {
      console.error('Error fetching question paper data:', error)
      // Fallback to existing data if API call fails
      setSelectedUser(questionpaper)
      setShowEditModal(true)
    }
  }
  const handleDelete = (staffId) => deleteMutation.mutate(staffId)
  const handleBulkDelete = (staffIds) => {
    staffIds.forEach(id => deleteMutation.mutate(id))
  }

  const handleFormSubmit = async (data) => {
    if (showEditModal && selectedUser) {
      await updateMutation.mutateAsync({ id: selectedUser.qpId, ...data })
    } else {
      await createMutation.mutateAsync(data)
    }
  }
   const handleStatusToggle = async (question) => {
    const newStatus = !question.status
    await updateMutation.mutateAsync({ 
      id: question.qpId, 
      status: newStatus 
    })
    refetch()
  }

  const handlePrint = async (questionpaper) => {
    try {
      const response = await questionpaperService.getById(questionpaper.qpId)
      const qp = response.data || response
      
      // If no questionSet but file exists, open the file
      if ((!qp.questionSet || !Array.isArray(qp.questionSet) || qp.questionSet.length === 0) && qp.fileUrl) {
        const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000'
        const fileUrl = qp.fileUrl.startsWith('http') ? qp.fileUrl : `${baseUrl}${qp.fileUrl.startsWith('/') ? '' : '/'}${qp.fileUrl}`
        window.open(fileUrl, '_blank')
        return
      }
      
      const printWindow = window.open('', '_blank')
      printWindow.document.write(`
        <html>
          <head>
            <title>${qp.title}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; }
              h1 { text-align: center; margin-bottom: 10px; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 10px; }
              .info { display: flex; justify-content: space-between; margin-bottom: 20px; }
              .question { margin-bottom: 20px; page-break-inside: avoid; }
              .question-number { font-weight: bold; margin-bottom: 5px; }
              .options { margin-left: 20px; }
              .option { margin: 5px 0; }
              @media print { body { padding: 20px; } }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${qp.title}</h1>
              <div class="info">
                <span>Subject: ${qp.subject?.name || 'N/A'}</span>
                <span>Date: ${new Date(qp.examDate).toLocaleDateString()}</span>
                <span>Total Marks: ${qp.totalMarks}</span>
                <span>Duration: ${qp.duration} mins</span>
              </div>
            </div>
            ${qp.description ? `<p><strong>Instructions:</strong> ${qp.description}</p>` : ''}
            <div class="questions">
              ${qp.questionSet && Array.isArray(qp.questionSet) ? qp.questionSet.map((q, idx) => `
                <div class="question">
                  <div class="question-number">Q${idx + 1}. ${q.questionText || q.question}</div>
                  ${q.imageUrl ? `<img src="${window.location.origin}${q.imageUrl}" alt="Question ${idx + 1}" style="max-width: 400px; margin: 10px 0; border-radius: 4px;" />` : ''}
                  ${q.options && Array.isArray(q.options) ? `
                    <div class="options">
                      ${q.options.map((opt, i) => `
                        <div class="option">${String.fromCharCode(65 + i)}. ${opt}</div>
                      `).join('')}
                    </div>
                  ` : ''}
                </div>
              `).join('') : '<p>No questions available</p>'}
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => printWindow.print(), 250)
    } catch (error) {
      console.error('Error printing question paper:', error)
    }
  }
  

  const allowedActions = []
  if (can(PERMISSIONS.EDIT_QUESTION_PAPER)) allowedActions.push('edit', 'toggle')
  if (can(PERMISSIONS.DELETE_QUESTION_PAPER)) allowedActions.push('delete')
  if (can(PERMISSIONS.VIEW_QUESTION_PAPERS)) allowedActions.push('print')

  return (
    <>
      <GenericDataTable
        data={questionpapers}
        columns={questionpaperTableConfig.columns}
        title={questionpaperTableConfig.title}
        description={questionpaperTableConfig.description}
        isLoading={isLoading}
        error={error}
        onRefetch={refetch}
        onAdd={can(PERMISSIONS.CREATE_QUESTION_PAPER) ? handleAdd : undefined}
        onView={handleView}
        onEdit={can(PERMISSIONS.EDIT_QUESTION_PAPER) ? handleEdit : undefined}
        onStatusToggle={can(PERMISSIONS.EDIT_QUESTION_PAPER) ? handleStatusToggle : undefined}
        onDelete={can(PERMISSIONS.DELETE_QUESTION_PAPER) ? handleDelete : undefined}
        onBulkDelete={can(PERMISSIONS.DELETE_QUESTION_PAPER) ? handleBulkDelete : undefined}
        onPrint={can(PERMISSIONS.VIEW_QUESTION_PAPERS) ? handlePrint : undefined}
        searchFields={questionpaperTableConfig.searchFields}
        filterConfig={questionpaperTableConfig.filterConfig}
        statusField={questionpaperTableConfig.statusField}
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
        title={showEditModal ? 'Edit QuestionPaper' : questionPaperFormConfig.title}
        fields={questionPaperFormConfig.fields}
        initialData={showEditModal && selectedUser ? selectedUser : null}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
      
     
    </>
  )
}

export default QuestionPaperTable