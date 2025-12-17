import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MoreHorizontal, Edit, Trash2, Eye, Plus, Loader2, Printer } from 'lucide-react'
import { Button } from './Button'
import { Input } from './Input'
import AdvancedFilter from './AdvancedFilter'
import StatusSummary from './StatusSummary'
import VirtualTable from './VirtualTable'

const GenericDataTable = ({
  data = [],
  columns = [],
  title,
  description,
  isLoading = false,
  error = null,
  onRefetch,
  onAdd,
  onView,
  onEdit,
  onDelete,
  onStatusToggle,
  onBulkDelete,
  onPrint,
  onBypass,
  searchFields = [],
  filterConfig = {},
  statusField = null,
  renderCell = null,
  actions = ['view', 'edit', 'delete'],
  enableVirtualization = false,
  rowHeight = 60,
  itemsPerPage = 10
}) => {
  // Ensure unique actions
  const uniqueActions = useMemo(() => [...new Set(actions)], [actions])
  const [searchTerm, setSearchTerm] = useState('')
  const [showActions, setShowActions] = useState(null)
  const [selectedItems, setSelectedItems] = useState([])
  const [visibleColumns, setVisibleColumns] = useState(columns.map(col => col.key))
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null })
  const [filterState, setFilterState] = useState(filterConfig)
  const [currentPage, setCurrentPage] = useState(1)

  const { filteredData, paginatedData, totalPages } = useMemo(() => {
    if (!Array.isArray(data)) return []
    
    let filtered = data.filter(item => {
      // Search filter
      const matchesSearch = !searchTerm || searchFields.some(field => 
        item[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
      
      // Dynamic filters
      const matchesFilters = Object.keys(filterState).every(filterKey => {
        const selectedValues = filterState[filterKey].filter(f => f.selected).map(f => f.value)
        return selectedValues.length === 0 || selectedValues.includes(item[filterKey])
      })
      
      return matchesSearch && matchesFilters
    })

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key]
        const bVal = b[sortConfig.key]
        if (sortConfig.direction === 'asc') {
          return aVal > bVal ? 1 : -1
        } else {
          return aVal < bVal ? 1 : -1
        }
      })
    }

    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedData = filtered.slice(startIndex, endIndex)
    const totalPages = Math.ceil(filtered.length / itemsPerPage)

    return { filteredData: filtered, paginatedData, totalPages }
  }, [data, searchTerm, filterState, sortConfig, searchFields, currentPage, itemsPerPage])

  const statusCounts = useMemo(() => {
    if (!statusField || !Array.isArray(data)) return {}
    return data.reduce((acc, item) => {
      acc[item[statusField]] = (acc[item[statusField]] || 0) + 1
      return acc
    }, {})
  }, [data, statusField])

  const handleSelectItem = (itemId, checked) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId])
    } else {
      setSelectedItems(selectedItems.filter(id => id !== itemId))
    }
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(filteredData.map(item => item.staffId || item.studentId || item.examId || item.resultId || item.timetableId || item.attendanceId || item.qpId || item.materialId || item.classId || item.subjectId || item.batchId || item.notificationId || item.courseId || item.userId || item.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleBulkDelete = () => {
    onBulkDelete?.(selectedItems)
    setSelectedItems([])
  }

  const handleColumnToggle = (columnKey) => {
    setVisibleColumns(prev => 
      prev.includes(columnKey) 
        ? prev.filter(col => col !== columnKey)
        : [...prev, columnKey]
    )
  }

  const handleSort = (key, direction) => {
    setSortConfig({ key, direction })
  }

  const handleFilterChange = (filterKey, value) => {
    setFilterState(prev => ({
      ...prev,
      [filterKey]: prev[filterKey].map(option => 
        option.value === value 
          ? { ...option, selected: !option.selected }
          : option
      )
    }))
  }

  const defaultRenderCell = (item, column) => {
    const value = item[column.key]
    
    if (column.render) {
      return column.render(value, item)
    }
    
    if (column.type === 'badge') {
      const displayValue = typeof value === 'boolean' ? (value ? 'Active' : 'Inactive') : value
      return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${column.getBadgeColor?.(value) || 'bg-gray-100 text-gray-800'}`}>
          {displayValue}
        </span>
      )
    }
    
    if (column.type === 'user') {
      return (
        <div className="flex items-center gap-3">
          <img
            src={item.avatar || item.profilePic || item.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(value || 'User')}&background=0ea5e9&color=fff`}
            alt={value}
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(value || 'User')}&background=0ea5e9&color=fff` }}
          />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{value}</p>
            {item.email && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.email}</p>
            )}
          </div>
        </div>
      )
    }
    
    return <span className="text-sm">{value}</span>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold gradient-text flex items-center gap-2">
            {title}
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
          </h2>
          {description && (
            <p className="text-gray-600 dark:text-gray-400">{description}</p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          {Object.keys(filterState).length > 0 && (
            <AdvancedFilter
              columns={columns}
              visibleColumns={visibleColumns}
              onColumnToggle={handleColumnToggle}
              sortConfig={sortConfig}
              onSort={handleSort}
              filters={filterState}
              onFilterChange={handleFilterChange}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          )}
          
          {selectedItems.length > 0 && onBulkDelete && (
            <Button
              variant="outline"
              onClick={handleBulkDelete}
              className="text-red-600 hover:text-red-700"
            >
              Delete ({selectedItems.length})
            </Button>
          )}
          
          {onAdd && (
            <Button onClick={onAdd} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          )}
        </div>
      </div>

      {/* Status Summary */}
      {statusField && Object.keys(statusCounts).length > 0 && (
        <StatusSummary data={statusCounts} />
      )}

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {enableVirtualization && filteredData.length > 100 ? (
          <VirtualTable
            data={filteredData}
            columns={columns.filter(col => visibleColumns.includes(col.key))}
            rowHeight={rowHeight}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            renderCell={renderCell || defaultRenderCell}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            actions={actions}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-600 dark:text-gray-400 w-12">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === (filteredData?.length || 0) && (filteredData?.length || 0) > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                  />
                </th>
                {columns.map(column => (
                  visibleColumns.includes(column.key) && (
                    <th key={column.key} className="text-left py-4 px-6 font-medium text-gray-600 dark:text-gray-400">
                      {column.label}
                    </th>
                  )
                ))}
                <th className="text-right py-4 px-6 font-medium text-gray-600 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {(paginatedData || []).map((item, index) => {
                  const itemId = item.staffId || item.studentId || item.examId || item.resultId || item.timetableId || item.attendanceId || item.qpId || item.materialId || item.classId || item.subjectId || item.batchId || item.notificationId || item.courseId || item.userId || item.id
                  const uniqueKey = `${itemId}-${index}`
                  return (
                  <motion.tr
                    key={uniqueKey}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                      selectedItems.includes(item.staffId || item.studentId || item.examId || item.resultId || item.timetableId || item.attendanceId || item.qpId || item.materialId || item.classId || item.subjectId || item.batchId || item.notificationId || item.courseId || item.userId || item.id) ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                    }`}
                  >
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.staffId || item.studentId || item.examId || item.resultId || item.timetableId || item.attendanceId || item.qpId || item.materialId || item.classId || item.subjectId || item.batchId || item.notificationId || item.courseId || item.userId || item.id)}
                        onChange={(e) => handleSelectItem(item.staffId || item.studentId || item.examId || item.resultId || item.timetableId || item.attendanceId || item.qpId || item.materialId || item.classId || item.subjectId || item.batchId || item.notificationId || item.courseId || item.userId || item.id, e.target.checked)}
                        className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                      />
                    </td>
                    
                    {columns.map(column => (
                      visibleColumns.includes(column.key) && (
                        <td key={column.key} className="py-4 px-6">
                          {renderCell ? renderCell(item, column) : defaultRenderCell(item, column)}
                        </td>
                      )
                    ))}
                    
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {uniqueActions.map(action => {
                          if (action === 'view' && onView) {
                            return (
                              <Button key="view" variant="ghost" size="icon" onClick={() => onView(item)} title="View">
                                <Eye className="h-4 w-4" />
                              </Button>
                            )
                          }
                          if (action === 'print' && onPrint) {
                            return (
                              <Button key="print" variant="ghost" size="icon" onClick={() => onPrint(item)} title="Print" className="text-blue-600 hover:text-blue-700">
                                <Printer className="h-4 w-4" />
                              </Button>
                            )
                          }
                          if (action === 'edit' && onEdit) {
                            return (
                              <Button key="edit" variant="ghost" size="icon" onClick={() => onEdit(item)} title="Edit">
                                <Edit className="h-4 w-4" />
                              </Button>
                            )
                          }
                          if (action === 'toggle' && onStatusToggle) {
                            return (
                              <Button key="toggle" variant="ghost" size="icon" onClick={() => onStatusToggle(item)} title={item.status ? 'Deactivate' : 'Activate'} className={item.status ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}>
                                <div className={`h-4 w-4 rounded-full ${item.status ? 'bg-red-500' : 'bg-green-500'}`} />
                              </Button>
                            )
                          }
                          if (action === 'bypass' && onBypass) {
                            const isCompleted = item.feeStatus === 'Completed';
                            return (
                              <Button 
                                key="bypass" 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => !isCompleted && onBypass(item)} 
                                title={isCompleted ? 'Already Completed' : 'Bypass Fees'} 
                                className={isCompleted ? 'text-gray-400 cursor-not-allowed' : 'text-orange-600 hover:text-orange-700'}
                                disabled={isCompleted}
                              >
                                Bypass
                              </Button>
                            )
                          }
                          if (action === 'delete' && onDelete) {
                            return (
                              <Button key="delete" variant="ghost" size="icon" onClick={() => onDelete(item.staffId || item.studentId || item.examId || item.resultId || item.timetableId || item.attendanceId || item.qpId || item.materialId || item.classId || item.subjectId || item.batchId || item.notificationId || item.courseId || item.userId || item.id)} title="Delete" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )
                          }
                          return null
                        })}
                      </div>
                    </td>
                  </motion.tr>
                  )
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        )}
        
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-500" />
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">Failed to load data</p>
            <Button onClick={onRefetch} variant="outline">Try Again</Button>
          </div>
        ) : !filteredData || filteredData.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-gray-500"
          >
            No data found matching your search.
          </motion.div>
        ) : null}
        
        {/* Pagination */}
        {filteredData && filteredData.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData?.length || 0)} of {filteredData?.length || 0} results
            </div>
            <div className="flex items-center gap-2">
              {totalPages > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i
                    if (pageNum > totalPages) return null
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GenericDataTable