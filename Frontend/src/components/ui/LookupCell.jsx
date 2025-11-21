import { useState, useEffect } from 'react'
import { getStaffNames, getSubjectNames, getCourseNames, getBatchNames } from '../../utils/lookupHelpers'

const LookupCell = ({ ids, type }) => {
  const [names, setNames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNames = async () => {
      if (!ids || (Array.isArray(ids) && ids.length === 0)) {
        setNames([])
        setLoading(false)
        return
      }

      try {
        let result = []
        switch (type) {
          case 'staff':
            result = await getStaffNames(ids)
            break
          case 'subject':
            result = await getSubjectNames(ids)
            break
          case 'course':
            result = await getCourseNames(ids)
            break
          case 'batch':
            result = await getBatchNames(ids)
            break
          default:
            result = Array.isArray(ids) ? ids : [ids]
        }
        setNames(result)
      } catch (error) {
        console.error(`Error fetching ${type} names:`, error)
        setNames(Array.isArray(ids) ? ids : [ids])
      } finally {
        setLoading(false)
      }
    }

    fetchNames()
  }, [ids, type])

  if (loading) {
    return <span className="text-gray-400">Loading...</span>
  }

  if (!names || names.length === 0) {
    return <span className="text-gray-400">N/A</span>
  }

  return <span>{names.join(', ')}</span>
}

export default LookupCell