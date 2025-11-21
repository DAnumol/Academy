// import { useState } from 'react'
// import GenericDataTable from '@components/ui/GenericDataTable'
// import GenericFormModal from '@components/ui/GenericFormModal'
// // import ViewUserModal from './ViewUserModal'
// import { useGenericCRUD } from '@hooks/useGenericCRUD'
// // import { userService } from '@/services/userService'
// // import { studentTableConfig } from '@config/tableConfigs'
// import { studentService } from '../../../services/studentService'
// import { studentFormConfig } from '../../../config/formConfigs'
// import { studentTableConfig } from '../../../config/tableConfigs'
// // import { studentFormConfig } from '@config/formConfigs'

// const StudentTable = () => {
//   const [showAddModal, setShowAddModal] = useState(false)
//   const [showViewModal, setShowViewModal] = useState(false)
//   const [showEditModal, setShowEditModal] = useState(false)
//   const [selectedStudent, setSelectedStudent] = useState(null)
  
//   // Generic CRUD hooks
//   const { useList, useCreate, useUpdate, useDelete } = useGenericCRUD({
//     queryKey: 'students',
//     service: {
//       getAll: studentService.getAll,
//       create: studentService.create,
//       update: studentService.update,
//       delete: studentService.delete
//     },
//     messages: {
//       create: 'Student details created successfully!',
//       update: 'Student details updated successfully!',
//       delete: 'Student details deleted successfully!'
//     }
//   })
  
//   const { data: result = {}, isLoading, error, refetch } = useList()
//   const students = result.data || []
//   const createMutation = useCreate()
//   const updateMutation = useUpdate()
//   const deleteMutation = useDelete()

//   const handleAdd = () => {
//     setSelectedStudent(null)
//     setShowAddModal(true)
//   }
//   const handleView = (student) => {
//     setSelectedStudent(student)
//     setShowViewModal(true)
//   }
//   const handleEdit = async (student) => {
//     try {
//       // Fetch complete student data for editing
//       const studentId = student.studentId || student.id
//       const response = await studentService.getById(studentId)
//       const completeStudentData = response.data || response
//       setSelectedStudent(completeStudentData)
//       setShowEditModal(true)
//     } catch (error) {
//       console.error('Error fetching student data:', error)
//       // Fallback to existing data if API call fails
//       setSelectedStudent(student)
//       setShowEditModal(true)
//     }
//   }
//   const handleDelete = (studentId) => deleteMutation.mutate(studentId)
//   const handleBulkDelete = (studentIds) => {
//     studentIds.forEach(id => deleteMutation.mutate(id))
//   }

//   const handleFormSubmit = async (data) => {
//     if (showEditModal && selectedStudent) {
//       await updateMutation.mutateAsync({ id: selectedStudent.id, ...data })
//     } else {
//       await createMutation.mutateAsync(data)
//     }
//   }

//   return (
//     <>
//       <GenericDataTable
//         data={students}
//         columns={studentTableConfig.columns}
//         title={studentTableConfig.title}
//         description={studentTableConfig.description}
//         isLoading={isLoading}
//         error={error}
//         onRefetch={refetch}
//         onAdd={handleAdd}
//         onView={handleView}
//         onEdit={handleEdit}
//         onDelete={handleDelete}
//         onBulkDelete={handleBulkDelete}
//         searchFields={studentTableConfig.searchFields}
//         filterConfig={studentTableConfig.filterConfig}
//         statusField={studentTableConfig.statusField}
//       />
      
//       {/* Add/Edit Modal */}
//       <GenericFormModal
//         isOpen={showAddModal || showEditModal}
//         onClose={() => {
//           setShowAddModal(false)
//           setShowEditModal(false)
//           setSelectedStudent(null)
//         }}
//         onSubmit={handleFormSubmit}
//         title={showEditModal ? 'Edit User' : studentFormConfig.title}
//         fields={studentFormConfig.fields}
//         initialData={showEditModal && selectedStudent ? selectedStudent : null}
//         isLoading={createMutation.isPending || updateMutation.isPending}
//       />
      
//       {/* View Modal */}
//       {/* <ViewUserModal
//         isOpen={showViewModal}
//         onClose={() => setShowViewModal(false)}
//         user={selectedUser}
//         onEdit={(user) => {
//           setShowViewModal(false)
//           handleEdit(user)
//         }}
//       /> */}
//     </>
//   )
// }

// export default StudentTable



import { useState } from 'react'
import GenericDataTable from '@components/ui/GenericDataTable'
import GenericFormModal from '@components/ui/GenericFormModal'
import { useGenericCRUD } from '@hooks/useGenericCRUD'
import { usePermissions } from '@/hooks/usePermissions'
import { PERMISSIONS } from '@/config/rolePermissions'
import { studentService } from '../../../services/studentService'
import { studentFormConfig } from '../../../config/formConfigs'
import { studentTableConfig } from '../../../config/tableConfigs'
 
const StudentTable = () => {
  const { can } = usePermissions()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
 
  // Generic CRUD hooks
  const { useList, useCreate, useUpdate, useDelete } = useGenericCRUD({
    queryKey: 'students',
    service: {
      getAll: studentService.getAll,
      create: studentService.create,
      update: studentService.update,
      delete: studentService.delete
    },
    messages: {
      create: 'Student details created successfully!',
      update: 'Student details updated successfully!',
      delete: 'Student details deleted successfully!'
    }
  })
 
  const { data: result = {}, isLoading, error, refetch } = useList()
  const students = result.data || []
  const createMutation = useCreate()
  const updateMutation = useUpdate()
  const deleteMutation = useDelete()
 
  const handleAdd = () => {
    setSelectedStudent(null)
    setShowAddModal(true)
  }
 
const handleStatusToggle = async (student) => {
    const newStatus = !student.status
    await updateMutation.mutateAsync({ 
      id: student.studentId, 
      name: student.name,
      // email: user.email,
      // role: user.role,
      status: newStatus 
    })
    refetch()
  }
  
 
  const handleEdit = async (student) => {
    try {
      const studentId = student.studentId || student.id
      const response = await studentService.getById(studentId)
      const studentData = response.data || response
     
      // Map backend fields to form fields
      const formData = {
        ...studentData,
        dateofbirth: studentData.dob,
        avatar: studentData.profilePicUrl || studentData.profilePic,
        status: studentData.status
      }
     
      setSelectedStudent(formData)
      setShowEditModal(true)
    } catch (error) {
      console.error('Error fetching student data:', error)
      setSelectedStudent(student)
      setShowEditModal(true)
    }
  }
  const handleDelete = (studentId) => deleteMutation.mutate(studentId)

  const handleBulkDelete = (studentIds) => {
    studentIds.forEach(id => deleteMutation.mutate(id))
  }
 
  const handleFormSubmit = async (data) => {
    console.log('Raw form data:', data)
    
    const submitData = { ...data }
    
 
    
    // Remove empty string values (but keep avatar)
    Object.keys(submitData).forEach(key => {
      if (key !== 'avatar' && (submitData[key] === '' || submitData[key] === null || submitData[key] === undefined)) {
        delete submitData[key]
      }
    })
    
    console.log('Cleaned data to submit:', submitData)
    console.log('Keys being sent:', Object.keys(submitData))
    
    if (showEditModal && selectedStudent) {
      const studentId = selectedStudent.studentId || selectedStudent.id
      await updateMutation.mutateAsync({ id: studentId, ...submitData })
    } else {
      await createMutation.mutateAsync(submitData)
    }
  }
 
  const allowedActions = []
  if (can(PERMISSIONS.EDIT_STUDENT)) allowedActions.push('edit', 'toggle')
  if (can(PERMISSIONS.DELETE_STUDENT)) allowedActions.push('delete')

  return (
    <>
      <GenericDataTable
        data={students}
        columns={studentTableConfig.columns}
        title={studentTableConfig.title}
        description={studentTableConfig.description}
        isLoading={isLoading}
        error={error}
        onRefetch={refetch}
        onAdd={can(PERMISSIONS.CREATE_STUDENT) ? handleAdd : undefined}
        onEdit={can(PERMISSIONS.EDIT_STUDENT) ? handleEdit : undefined}
        onDelete={can(PERMISSIONS.DELETE_STUDENT) ? handleDelete : undefined}
        onStatusToggle={can(PERMISSIONS.EDIT_STUDENT) ? handleStatusToggle : undefined}
        onBulkDelete={can(PERMISSIONS.DELETE_STUDENT) ? handleBulkDelete : undefined}
        searchFields={studentTableConfig.searchFields}
        filterConfig={studentTableConfig.filterConfig}
        statusField={studentTableConfig.statusField}
        actions={allowedActions}
      />
     
      {/* Add/Edit Modal */}
      <GenericFormModal
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false)
          setShowEditModal(false)
          setSelectedStudent(null)
        }}
        onSubmit={handleFormSubmit}
        title={showEditModal ? 'Edit User' : studentFormConfig.title}
        fields={studentFormConfig.fields}
        initialData={showEditModal && selectedStudent ? selectedStudent : null}
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
 
export default StudentTable
 