/**
 * Helper function to fetch complete entity data for editing
 * @param {Object} entity - The entity object from table row
 * @param {Object} service - The service object with getById method
 * @param {Function} setSelectedEntity - State setter function
 * @param {Function} setShowEditModal - Modal state setter function
 * @param {string} entityName - Name of entity for logging (optional)
 */
export const handleEditWithFetch = async (
  entity, 
  service, 
  setSelectedEntity, 
  setShowEditModal, 
  entityName = 'entity'
) => {
  try {
    // Try different ID field names based on entity type
    const entityId = entity.id || 
                    entity.staffId || 
                    entity.studentId || 
                    entity.userId || 
                    entity.courseId || 
                    entity.batchId || 
                    entity.subjectId ||
                    entity.examId ||
                    entity.resultId ||
                    entity.attendanceId ||
                    entity.classId ||
                    entity.timetableId ||
                    entity.materialId ||
                    entity.questionPaperId

    if (!entityId) {
      console.warn(`No valid ID found for ${entityName}:`, entity)
      // Fallback to existing data
      setSelectedEntity(entity)
      setShowEditModal(true)
      return
    }

    // Fetch complete data from API
    const response = await service.getById(entityId)
    const completeData = response.data || response
    
    setSelectedEntity(completeData)
    setShowEditModal(true)
  } catch (error) {
    console.error(`Error fetching ${entityName} data:`, error)
    // Fallback to existing data if API call fails
    setSelectedEntity(entity)
    setShowEditModal(true)
  }
}

/**
 * Helper function to get the correct ID field from an entity
 * @param {Object} entity - The entity object
 * @returns {string|number|null} - The ID value or null if not found
 */
export const getEntityId = (entity) => {
  return entity.id || 
         entity.staffId || 
         entity.studentId || 
         entity.userId || 
         entity.courseId || 
         entity.batchId || 
         entity.subjectId ||
         entity.examId ||
         entity.resultId ||
         entity.attendanceId ||
         entity.classId ||
         entity.timetableId ||
         entity.materialId ||
         entity.questionPaperId ||
         null
}