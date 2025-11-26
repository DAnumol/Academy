import { apiClient } from '../services/apiClient'

// Cache for lookup data
const lookupCache = {
  staff: new Map(),
  subjects: new Map(),
  courses: new Map(),
  batches: new Map()
}

// Generic lookup function for form dropdowns
const fetchFormDropdownData = async (endpoint) => {
  try {
    console.log(`Fetching dropdown data from: ${endpoint}`)
    const response = await apiClient.get(endpoint)
    console.log(`Response for ${endpoint}:`, response)
    
    const data = response.data || response
    let items = []
    
    // Handle different response structures
    if (endpoint === '/staff') {
      items = data.staff || data.data?.staff || data.data?.items || data.data || data || []
    } else if (endpoint === '/subjects') {
      items = data.subjects || data.data?.subjects || data.data?.items || data.data || data || []
    } else if (endpoint === '/batches') {
      items = data.batches || data.data?.batches || data.data?.items || data.data || data || []
    } else if (endpoint === '/students') {
      items = data.students || data.data?.students || data.data?.items || data.data || data || []
    } else if (endpoint === '/courses') {
      items = data.courses || data.data?.courses || data.data?.items || data.data || data || []
    } else if (endpoint === '/questionpapers') {
      items = data.questionPapers || data.data?.questionPapers || data.data?.items || data.data || data || []
    } else if (endpoint === '/exams') {
      items = data.exams || data.data?.exams || data.data?.items || data.data || data || []
    } else {
      items = data.data?.items || data.data || data || []
    }
    
    console.log(`Processed items for ${endpoint}:`, items)
    return items
  } catch (error) {
    console.error(`Error fetching dropdown data from ${endpoint}:`, error)
    return []
  }
}

// Generic lookup function
const fetchLookupData = async (type, ids) => {
  if (!Array.isArray(ids)) ids = [ids]
  
  const uncachedIds = ids.filter(id => !lookupCache[type].has(id))
  
  if (uncachedIds.length > 0) {
    try {
      const endpoint = type === 'staff' ? '/staff' : `/${type}`
      const response = await apiClient.get(endpoint, { skipErrorToast: true })
      const data = response.data || response
      
      let items = []
      if (type === 'staff') {
        items = data.staff || data.data?.staff || data.data || data || []
      } else if (type === 'subjects') {
        items = data.subjects || data.data?.subjects || data.data || data || []
      } else {
        items = data[type] || data.data?.[type] || data.data || data || []
      }
      
      items.forEach(item => {
        let id, name
        if (type === 'staff') {
          id = item.staffId || item.id
          name = item.name || item.staffName
        } else if (type === 'subjects') {
          id = item.subjectId || item.id
          name = item.name || item.subjectName
        } else if (type === 'batches') {
          id = item.batchId || item.id
          name = item.batchName || item.name
        } else if (type === 'courses') {
          id = item.courseId || item.id
          name = item.courseName || item.name
        } else {
          id = item.id
          name = item.name
        }
        
        if (id && name) {
          lookupCache[type].set(id, name)
        }
      })
    } catch (error) {
      console.error(`Error fetching ${type}:`, error)
    }
  }
  
  return ids.map(id => lookupCache[type].get(id) || id)
}

// Specific lookup functions
export const getStaffNames = async (staffIds) => {
  return await fetchLookupData('staff', staffIds)
}

export const getSubjectNames = async (subjectIds) => {
  return await fetchLookupData('subjects', subjectIds)
}

export const getCourseNames = async (courseIds) => {
  return await fetchLookupData('courses', courseIds)
}

export const getBatchNames = async (batchIds) => {
  return await fetchLookupData('batches', batchIds)
}

// Export the form dropdown function
export { fetchFormDropdownData }