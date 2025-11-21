import { useState, useMemo, useCallback, memo } from 'react'
import { motion } from 'framer-motion'
import VirtualScrollList from './VirtualScrollList'

const VirtualTable = memo(({
  data = [],
  columns = [],
  rowHeight = 60,
  headerHeight = 50,
  containerHeight = 500,
  onRowClick,
  onRowSelect,
  selectedRows = [],
  sortable = true,
  className = '',
  ...props
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [data, sortConfig])

  const handleSort = useCallback((key) => {
    if (!sortable) return

    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }, [sortable])

  const renderTableRow = useCallback((item, index) => {
    const isSelected = selectedRows.includes(item.id || index)
    
    return (
      <motion.div
        className={`flex items-center border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
          isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
        }`}
        onClick={onRowClick ? () => onRowClick(item, index) : undefined}
        whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
        transition={{ duration: 0.1 }}
      >
        {onRowSelect && (
          <div className="w-12 flex justify-center">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onRowSelect ? (e) => {
                e.stopPropagation()
                onRowSelect(item, index, e.target.checked)
              } : undefined}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        )}
        {columns.map((column, colIndex) => (
          <div
            key={colIndex}
            className={`px-4 py-3 ${column.className || ''}`}
            style={{ 
              width: column.width || 'auto',
              minWidth: column.minWidth || '100px',
              flex: column.flex || 'none'
            }}
          >
            {column.render 
              ? column.render(item[column.key], item, index)
              : item[column.key]
            }
          </div>
        ))}
      </motion.div>
    )
  }, [columns, selectedRows, onRowClick, onRowSelect])

  const getSortIcon = useCallback((columnKey) => {
    if (sortConfig.key !== columnKey) return '↕️'
    return sortConfig.direction === 'asc' ? '↑' : '↓'
  }, [sortConfig])

  return (
    <div className={`border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${className}`} {...props}>
      {/* Table Header */}
      <div 
        className="flex items-center bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 font-medium text-gray-900 dark:text-gray-100"
        style={{ height: headerHeight }}
      >
        {onRowSelect && (
          <div className="w-12 flex justify-center">
            <input
              type="checkbox"
              onChange={onRowSelect ? (e) => {
                if (e.target.checked) {
                  data.forEach((item, index) => onRowSelect(item, index, true))
                } else {
                  data.forEach((item, index) => onRowSelect(item, index, false))
                }
              } : undefined}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        )}
        {columns.map((column, index) => (
          <div
            key={index}
            className={`px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              column.className || ''
            }`}
            style={{ 
              width: column.width || 'auto',
              minWidth: column.minWidth || '100px',
              flex: column.flex || 'none'
            }}
            onClick={sortable ? () => handleSort(column.key) : undefined}
          >
            <div className="flex items-center justify-between">
              <span>{column.title}</span>
              {sortable && (
                <span className="ml-2 text-xs opacity-60">
                  {getSortIcon(column.key)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Virtual Scrolled Table Body */}
      <VirtualScrollList
        items={sortedData}
        itemHeight={rowHeight}
        containerHeight={containerHeight - headerHeight}
        renderItem={renderTableRow}
        overscan={3}
      />

      {/* Table Footer with Stats */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
        Showing {sortedData.length} items
        {selectedRows.length > 0 && (
          <span className="ml-4">
            {selectedRows.length} selected
          </span>
        )}
      </div>
    </div>
  )
})

VirtualTable.displayName = 'VirtualTable'

export default VirtualTable