import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, Columns, SortAsc, SortDesc, Eye, EyeOff, X, Search } from 'lucide-react'
import { Button } from './Button'
import { Input } from './Input'

const AdvancedFilter = ({ 
  columns, 
  visibleColumns, 
  onColumnToggle, 
  sortConfig, 
  onSort,
  filters,
  onFilterChange,
  searchTerm,
  onSearchChange
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('columns')

  const tabs = [
    { id: 'columns', label: 'Columns', icon: Columns },
    { id: 'sort', label: 'Sort', icon: SortAsc },
    { id: 'filter', label: 'Filter', icon: Filter }
  ]

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-primary-200 dark:border-primary-800"
      >
        <Filter className="w-4 h-4" />
        Advanced
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Filter Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute right-0 top-12 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold gradient-text">Advanced Options</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Tabs */}
                <div className="flex mt-3 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all relative ${
                          activeTab === tab.id
                            ? 'text-white'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                      >
                        {activeTab === tab.id && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-md"
                            transition={{ type: 'spring', duration: 0.5 }}
                          />
                        )}
                        <Icon className="w-4 h-4 relative z-10" />
                        <span className="relative z-10">{tab.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 max-h-96 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {activeTab === 'columns' && (
                    <motion.div
                      key="columns"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-3"
                    >
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Show/Hide Columns
                      </h4>
                      {columns.map((column) => (
                        <motion.label
                          key={column.key}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={visibleColumns.includes(column.key)}
                              onChange={() => onColumnToggle(column.key)}
                              className="sr-only"
                            />
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                              visibleColumns.includes(column.key)
                                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 border-primary-500'
                                : 'border-gray-300 dark:border-gray-600'
                            }`}>
                              {visibleColumns.includes(column.key) && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="text-white"
                                >
                                  <Eye className="w-3 h-3" />
                                </motion.div>
                              )}
                            </div>
                          </div>
                          <span className="text-sm font-medium">{column.label}</span>
                        </motion.label>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === 'sort' && (
                    <motion.div
                      key="sort"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-3"
                    >
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Sort Options
                      </h4>
                      {columns.map((column) => (
                        <div key={column.key} className="flex items-center gap-2">
                          <Button
                            variant={sortConfig.key === column.key && sortConfig.direction === 'asc' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => onSort(column.key, 'asc')}
                            className="flex-1"
                          >
                            <SortAsc className="w-4 h-4 mr-2" />
                            {column.label} ↑
                          </Button>
                          <Button
                            variant={sortConfig.key === column.key && sortConfig.direction === 'desc' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => onSort(column.key, 'desc')}
                            className="flex-1"
                          >
                            <SortDesc className="w-4 h-4 mr-2" />
                            {column.label} ↓
                          </Button>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === 'filter' && (
                    <motion.div
                      key="filter"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Search
                        </label>
                        <Input
                          placeholder="Search tasks..."
                          value={searchTerm}
                          onChange={(e) => onSearchChange(e.target.value)}
                          icon={Search}
                        />
                      </div>
                      
                      {Object.entries(filters).map(([filterKey, filterOptions]) => (
                        <div key={filterKey}>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block capitalize">
                            {filterKey}
                          </label>
                          <div className="space-y-2">
                            {filterOptions.map((option) => (
                              <motion.label
                                key={option.value}
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                                whileHover={{ x: 4 }}
                              >
                                <input
                                  type="checkbox"
                                  checked={option.selected}
                                  onChange={() => onFilterChange(filterKey, option.value)}
                                  className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                                />
                                <span className="text-sm">{option.label}</span>
                                {option.count && (
                                  <span className="text-xs text-gray-500 ml-auto bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                                    {option.count}
                                  </span>
                                )}
                              </motion.label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdvancedFilter