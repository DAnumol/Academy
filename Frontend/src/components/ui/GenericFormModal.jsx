import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import ResponsiveFormModal from './ResponsiveFormModal'
import { Button } from './Button'
import { Input } from './Input'
import Loader from './Loader'
import { FileUpload } from './FileUpload'
import { apiClient } from '../../services/apiClient'
import { useRef, useEffect } from 'react'

const GenericFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  fields = [],
  initialData = null,
  isLoading = false
}) => {

  const [customState, setCustomState] = useState({ tags: [], tagInput: '', avatar: null })
  const [isEditMode, setIsEditMode] = useState(false)
  const [modalKey, setModalKey] = useState(0)
  const [dynamicOptions, setDynamicOptions] = useState({})
  const [multiselectStates, setMultiselectStates] = useState({})
  const [inputMode, setInputMode] = useState(null) // 'file' or 'questionSet'
  const dropdownRefs = useRef({})

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm()

  // Handle click outside for multiselect dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(dropdownRefs.current).forEach(key => {
        if (dropdownRefs.current[key] && !dropdownRefs.current[key].contains(event.target)) {
          setMultiselectStates(prev => ({ ...prev, [key]: false }))
        }
      })
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Reset everything when modal state changes
  React.useEffect(() => {
    if (isOpen) {
      const hasData = initialData && typeof initialData === 'object' && Object.keys(initialData).length > 0
      setIsEditMode(hasData)
      console.log('Edit mode data:', initialData)
      setModalKey(prev => prev + 1) // Force re-render
      
      if (hasData) {
        // Edit mode - populate form with API data
        
        // Initialize customState with array fields from initialData
        const newCustomState = {
          tags: initialData.tags || [],
          tagInput: '',
          avatar: initialData.profilePic || initialData.avatar || initialData.image || null
        }
        
        // Add array fields to customState (filter out empty objects)
        fields.forEach(field => {
          if (field.type === 'array' && initialData[field.name]) {
            let arrayData = initialData[field.name]
            
            // Handle HTML-encoded JSON string from database
            if (typeof arrayData === 'string') {
              try {
                const decodedString = arrayData
                  .replace(/&quot;/g, '"')
                  .replace(/&amp;/g, '&')
                  .replace(/&lt;/g, '<')
                  .replace(/&gt;/g, '>')
                
                arrayData = JSON.parse(decodedString)
                console.log(`Decoded ${field.name} from HTML-encoded JSON:`, arrayData)
              } catch (e) {
                console.error(`Failed to parse ${field.name} as JSON:`, e)
                arrayData = [{}]
              }
            }
            
            const filteredArray = Array.isArray(arrayData) 
              ? arrayData.filter(item => item && Object.keys(item).length > 0)
              : []
            newCustomState[field.name] = filteredArray.length > 0 ? filteredArray : [{}]
            
            // Initialize arrayText fields (like options) in customState
            if (Array.isArray(filteredArray)) {
              filteredArray.forEach((item, index) => {
                field.fields?.forEach(subField => {
                  if (subField.type === 'arrayText') {
                    // Use existing options or initialize empty array
                    newCustomState[`${field.name}_${index}_${subField.name}`] = item[subField.name] || ['', '', '', '']
                  }
                })
                // Map question to questionText
                if (item.question && !item.questionText) {
                  item.questionText = item.question
                }
                // Map correctAnswer text to A/B/C/D
                if (item.correctAnswer && item.options && typeof item.correctAnswer === 'string') {
                  const answerIndex = item.options.findIndex(opt => opt === item.correctAnswer)
                  if (answerIndex !== -1) {
                    item.correctAnswer = String.fromCharCode(65 + answerIndex)
                  }
                }
              })
            }
          }
        })
        
        setCustomState(newCustomState)
        
        // Create a clean data object with only the fields that exist in the form
        const formData = {}
        fields.forEach(field => {
          if (initialData.hasOwnProperty(field.name)) {
            // Skip password field in edit mode to avoid showing bcrypt hash
            if (field.name === 'password') {
              formData[field.name] = ''
            } else if (field.type === 'array') {
              let arrayData = initialData[field.name]
              
              // Handle HTML-encoded JSON string from database
              if (typeof arrayData === 'string') {
                try {
                  const decodedString = arrayData
                    .replace(/&quot;/g, '"')
                    .replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                  
                  arrayData = JSON.parse(decodedString)
                } catch (e) {
                  console.error(`Failed to parse ${field.name} as JSON:`, e)
                  arrayData = []
                }
              }
              
              if (Array.isArray(arrayData)) {
                // Populate nested array fields for react-hook-form (filter out empty objects)
                const filteredArray = arrayData.filter(item => item && Object.keys(item).length > 0)
                filteredArray.forEach((item, index) => {
                  if (item.question && !item.questionText) item.questionText = item.question
                  if (item.correctAnswer && item.options && typeof item.correctAnswer === 'string') {
                    const answerIndex = item.options.findIndex(opt => opt === item.correctAnswer)
                    if (answerIndex !== -1) item.correctAnswer = String.fromCharCode(65 + answerIndex)
                  }
                  field.fields?.forEach(subField => {
                    const subFieldName = `${field.name}[${index}].${subField.name}`
                    formData[subFieldName] = item[subField.name] || ''
                  })
                })
              }
            } else {
              formData[field.name] = initialData[field.name]
            }
          }
        })
        
        reset(formData)
      } else {
        // Create mode - initialize array fields with one empty item and set default values
        const newCustomState = { tags: [], tagInput: '', avatar: null }
        const defaultValues = {}
        fields.forEach(field => {
          if (field.type === 'array') {
            newCustomState[field.name] = [{}]
          }
          if (field.defaultValue !== undefined) {
            defaultValues[field.name] = field.defaultValue
          }
        })
        setCustomState(newCustomState)
        reset(defaultValues)
      }
    } else {
      // Modal closed - complete reset
      reset({})
      setCustomState({ tags: [], tagInput: '', avatar: null })
      setIsEditMode(false)
      setInputMode(null)
    }
  }, [isOpen, initialData, reset, fields])

  // Load dynamic options for select fields with API endpoints
  React.useEffect(() => {
    if (isOpen) {
      const loadDynamicOptions = async () => {
        const optionsToLoad = {}
        
        // Helper function to process field for API endpoints
        const processField = async (field, fieldKey = field.name) => {
          if ((field.type === 'select' || field.type === 'multiselect') && field.apiEndpoint) {
            try {
              const response = await apiClient.get(field.apiEndpoint)
              
              let items = []
              const data = response.data || response
              
              // Handle different API response structures
              if (field.apiEndpoint === '/staff') {
                items = data.staff || data.data?.staff || data.data?.items || data.data || data || []
              } else if (field.apiEndpoint === '/subjects') {
                items = data.subjects || data.data?.subjects || data.data?.items || data.data || data || []
              } else if (field.apiEndpoint === '/batches') {
                items = data.batches || data.data?.batches || data.data?.items || data.data || data || []
              } else if (field.apiEndpoint === '/students') {
                items = data.students || data.data?.students || data.data?.items || data.data || data || []
              } else if (field.apiEndpoint === '/courses') {
                items = data.courses || data.data?.courses || data.data?.items || data.data || data || []
              } else if (field.apiEndpoint === '/questionpapers') {
                items = data.questionPapers || data.data?.questionPapers || data.data?.items || data.data || data || []
              } else if (field.apiEndpoint === '/exams') {
                items = data.exams || data.data?.exams || data.data?.items || data.data || data || []
              
                        } else if (field.apiEndpoint === '/users') {

                items = data.items || data.data?.items || data.data || data || []
                // Filter to show only students
                if (fieldKey === 'userId') {
                  items = items.filter(user => user.role === 'student')
                }
                        }else {
                items = data.data?.items || data.data || data || []
              }
              
              const options = Array.isArray(items) ? items.map(item => {
                const value = item[field.valueField || 'id']
                let label = item[field.labelField || 'name']
                
                // For userId field, include user data for auto-population
                if (fieldKey === 'userId') {
                  return { 
                    value, 
                    label: `${value} - ${label}`,
                    userData: { name: item.name, email: item.email }
                  }
                }
                
                // For exam field, show examId with question paper title
                if (field.labelField === 'examWithQP' && item.questionPaper) {
                  label = `${value} - ${item.questionPaper.title}`
                }
                
                return { value, label }
              }) : []
              
              optionsToLoad[fieldKey] = options
            } catch (error) {
              console.error(`Error loading options for ${fieldKey}:`, error)
              optionsToLoad[fieldKey] = []
            }
          }
        }
        
        // Process top-level fields
        for (const field of fields) {
          await processField(field)
          
          // Process nested array fields
          if (field.type === 'array' && field.fields) {
            for (const subField of field.fields) {
              await processField(subField, `${field.name}_${subField.name}`)
            }
          }
        }
        
        setDynamicOptions(optionsToLoad)
      }
      
      loadDynamicOptions()
    }
  }, [isOpen, fields])

  const handleFormSubmit = async (data) => {
    try {
      // Validate conditional requirements (file OR questionSet) - only for question paper form
      const isQuestionPaperForm = fields.some(f => f.name === 'questionSet')
      if (isQuestionPaperForm && !isEditMode) {
        const hasFile = customState.file || data.file
        const hasQuestionSet = customState.questionSet && customState.questionSet.length > 0 && customState.questionSet.some(q => q.questionText)
        
        if (!hasFile && !hasQuestionSet) {
          toast.error('Please either upload a file OR create a question set')
          return
        }
        
        if (hasFile && hasQuestionSet) {
          toast.error('Please choose only one: either upload a file OR create a question set, not both')
          return
        }
      }

      
      // Process array fields from form data FIRST (schedule[0].day format)
      const arrayFields = fields.filter(f => f.type === 'array')
      
      // Remove original array fields that might override processed ones
      arrayFields.forEach(field => {
        if (data[field.name]) delete data[field.name]
      })
      arrayFields.forEach(field => {
        const arrayData = []
        let hasFormFields = false
        
        // Check for form field format first (schedule[0].day)
        Object.keys(data).forEach(key => {
          const match = key.match(new RegExp(`^${field.name}\\[(\\d+)\\]\\.(.+)$`))
          if (match) {
            hasFormFields = true
            const index = parseInt(match[1])
            const subField = match[2]
            if (!arrayData[index]) arrayData[index] = {}
            arrayData[index][subField] = data[key]
            delete data[key]
          }
        })
        
        if (hasFormFields || customState[field.name]) {
          // Merge form fields with customState data (for arrayText options)
          const finalArray = hasFormFields ? arrayData : (customState[field.name] || [])
          finalArray.forEach((item, index) => {
            // Merge arrayText fields from customState
            field.fields?.forEach(subField => {
              if (subField.type === 'arrayText') {
                const optionsKey = `${field.name}_${index}_${subField.name}`
                if (customState[optionsKey]) {
                  item[subField.name] = customState[optionsKey]
                }
                // Also check if it exists in customState array items
                if (customState[field.name]?.[index]?.[subField.name]) {
                  item[subField.name] = customState[field.name][index][subField.name]
                }
              }
            })
          })
          data[field.name] = finalArray.filter(item => item && Object.keys(item).length > 0)
        } else if (data[field.name] && typeof data[field.name] === 'string') {
          // Parse HTML-encoded JSON from database
          try {
            const decodedString = data[field.name]
              .replace(/&quot;/g, '"')
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
            data[field.name] = JSON.parse(decodedString)
          } catch (e) {
            console.error(`Failed to parse ${field.name}:`, e)
          }
        }
      })
      
      // Process multiselect fields that come as JSON strings
      fields.forEach(field => {
        if (field.type === 'multiselect' && data[field.name] && typeof data[field.name] === 'string') {
          try {
            data[field.name] = JSON.parse(data[field.name])
          } catch (e) {
            console.error(`Failed to parse multiselect field ${field.name}:`, e)
            data[field.name] = []
          }
        }
      })
      
      // Add custom state data (but don't overwrite processed array fields)
      if (customState.tags && customState.tags.length > 0) {
        data.tags = customState.tags
      }
      if (customState.avatar) {
        data.avatar = customState.avatar
      }
      
      // Merge customState array fields with form data to preserve File objects
      fields.forEach(field => {
        if (field.type === 'array' && customState[field.name] && customState[field.name].length > 0) {
          if (data[field.name]) {
            // Merge File objects from customState into form data
            data[field.name].forEach((item, index) => {
              if (customState[field.name][index]) {
                // Copy File objects (like questionImage) from customState
                Object.keys(customState[field.name][index]).forEach(key => {
                  if (customState[field.name][index][key] instanceof File) {
                    item[key] = customState[field.name][index][key]
                  }
                })
              }
            })
          } else {
            const hasData = customState[field.name].some(item => Object.keys(item).length > 0)
            if (hasData) {
              data[field.name] = customState[field.name]
            }
          }
        }
      })
      
      const submitData = data
      console.log('Final form submission data:', submitData)
      console.log('CustomState at submission:', customState)
      
      // Debug: Check if File objects are present in questionSet
      if (submitData.questionSet) {
        submitData.questionSet.forEach((q, i) => {
          console.log(`Question ${i} - questionImage type:`, q.questionImage instanceof File ? 'File' : typeof q.questionImage, q.questionImage)
        })
      }
      
      await onSubmit(submitData)
      handleClose()
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error('Form submission failed. Please try again.')
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      reset({})
      setCustomState({ tags: [], tagInput: '', avatar: null })
      setIsEditMode(false)
      onClose()
    }
  }

  const sectionIcons = {
    profile: <svg className="w-5 h-5 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    basic: <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    permissions: <svg className="w-5 h-5 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    assignment: <svg className="w-5 h-5 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
    professional: <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    tags: <svg className="w-5 h-5 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
  }

  const getSectionIcon = (sectionName) => {
    return sectionIcons[sectionName] || <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
  }

  const renderField = (field, index) => {
    const { name, label, type = 'text', placeholder, required, validation = {}, options = [], render } = field

    // Custom render function
    if (render) {
      return render({ register, errors, watch, setValue, customState, setCustomState })
    }

    // Standard input types
    if (type === 'text' || type === 'email' || type === 'password' || type === 'number') {
      const fieldValue = watch(name)
      const userIdValue = watch('userId')
      
      // Auto-calculate percentage and grade for result form
      React.useEffect(() => {
        if (name === 'percentage' || name === 'grade') {
          const totalMarks = parseFloat(watch('totalMarks')) || 0
          const obtainedMarks = parseFloat(watch('obtainedMarks')) || 0
          
          if (totalMarks > 0 && obtainedMarks >= 0) {
            const percentage = ((obtainedMarks / totalMarks) * 100).toFixed(2)
            
            if (name === 'percentage') {
              setValue('percentage', percentage)
            }
            
            if (name === 'grade') {
              let grade = 'F'
              if (percentage >= 90) grade = 'A+'
              else if (percentage >= 80) grade = 'A'
              else if (percentage >= 70) grade = 'B+'
              else if (percentage >= 60) grade = 'B'
              else if (percentage >= 50) grade = 'C'
              else if (percentage >= 40) grade = 'D'
              setValue('grade', grade)
            }
          }
        }
      }, [watch('totalMarks'), watch('obtainedMarks')])
      
      // Check if field should be disabled based on disableWhenEmpty property
      const shouldDisable = field.disableWhenEmpty ? !watch(field.disableWhenEmpty) : false
      const isDisabled = field.disabled || shouldDisable || name === 'percentage' || name === 'grade'
      
      return (
        <div key={name} className="w-full">
          <Input
            label={label}
            type={type}
            placeholder={placeholder}
            error={errors[name]?.message}
            value={fieldValue || ''}
            disabled={isDisabled}
            {...register(name, {
              required: required ? `${label} is required` : false,
              ...validation
            })}
          />
        </div>
      )
    }

    // Multiselect with checkboxes dropdown
    if (type === 'multiselect') {
      const selectOptions = field.apiEndpoint ? (dynamicOptions[name] || []) : (options || [])
      const watchValue = watch(name)
      const selectedValues = Array.isArray(watchValue) ? watchValue : []
      const isOpen = multiselectStates[name] || false
      
      const toggleDropdown = () => {
        setMultiselectStates(prev => ({ ...prev, [name]: !prev[name] }))
      }
      
      const toggleSelection = (value) => {
        const current = selectedValues || []
        const newSelection = current.includes(value)
          ? current.filter(v => v !== value)
          : [...current, value]
        setValue(name, newSelection)
      }
      
      const removeItem = (valueToRemove) => {
        const newSelection = selectedValues.filter(v => v !== valueToRemove)
        setValue(name, newSelection)
      }
      
      return (
        <div key={name} className="w-full space-y-2 relative" ref={el => dropdownRefs.current[name] = el}>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            <div
              onClick={toggleDropdown}
              className={`w-full min-h-[42px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm cursor-pointer focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${errors[name] ? 'border-red-500' : ''}`}
            >
              {selectedValues.length === 0 ? (
                <span className="text-gray-500">{placeholder || `Select ${label.toLowerCase()}`}</span>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {selectedValues.map(value => {
                    const option = selectOptions.find(opt => opt.value === value)
                    return option ? (
                      <span
                        key={value}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded text-xs"
                      >
                        {option.label}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeItem(value)
                          }}
                          className="hover:text-primary-600 dark:hover:text-primary-300"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ) : null
                  })}
                </div>
              )}
            </div>
            {isOpen && selectOptions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 shadow-lg max-h-48 overflow-y-auto">
                {selectOptions.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-500">No options available</div>
                ) : (
                  selectOptions.map(option => (
                    <label
                      key={option.value}
                      className="flex items-center px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0"
                    >
                      <input
                        type="checkbox"
                        checked={selectedValues.includes(option.value)}
                        onChange={() => toggleSelection(option.value)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                    </label>
                  ))
                )}
              </div>
            )}
          </div>
          {errors[name] && (
            <p className="text-sm text-red-500 mt-1">{errors[name].message}</p>
          )}
          <input type="hidden" {...register(name)} value={JSON.stringify(selectedValues)} />
        </div>
      )
    }

    // Select dropdown with icon
    if (type === 'select') {
      const getSelectIcon = () => {
        if (name === 'role') return <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        if (name === 'priority') return <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
        if (name === 'assignee' || name === 'userId') return <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        if (name === 'status') return <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        if (name === 'subjectExpertise' || name === 'assignedBatch') return <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
        return null
      }
      
      // Use dynamic options if available, otherwise use static options
      const selectOptions = field.apiEndpoint ? (dynamicOptions[name] || []) : (options || [])
      
      return (
        <div key={name} className="w-full space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            {getSelectIcon() && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                {getSelectIcon()}
              </div>
            )}
            <select
              className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${getSelectIcon() ? 'pl-10' : ''} ${errors[name] ? 'border-red-500' : ''}`}
              value={watch(name) || ''}
              {...register(name, {
                required: required ? `${label} is required` : false,
                ...validation
              })}
              onChange={(e) => {
                setValue(name, e.target.value)
                // Handle userId selection to populate name and email fields
                if (field.onChange === 'populateUserFields' && e.target.value) {
                  const selectedUser = selectOptions.find(option => option.value === e.target.value)
                  if (selectedUser && selectedUser.userData) {
                    setValue('name', selectedUser.userData.name)
                    setValue('email', selectedUser.userData.email)
                  }
                }
              }}
            >
              <option value="">{placeholder || `Select ${label.toLowerCase()}`}</option>
              {selectOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {errors[name] && (
            <p className="text-sm text-red-500 mt-1">{errors[name].message}</p>
          )}
        </div>
      )
    }

    // Textarea
    if (type === 'textarea') {
      return (
        <div key={name} className="w-full space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <textarea
            className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-colors ${errors[name] ? 'border-red-500' : ''}`}
            rows={4}
            placeholder={placeholder}
            value={watch(name) || ''}
            {...register(name, {
              required: required ? `${label} is required` : false,
              ...validation
            })}
          />
          {errors[name] && (
            <p className="text-sm text-red-500 mt-1">{errors[name].message}</p>
          )}
        </div>
      )
    }

    // Profile image upload with avatar preview (for staff management)
    if (type === 'avatar') {
      const previewUrl = customState.avatar
      
      return (
        <div key={name} className="w-full space-y-4">
          <div className="flex items-center justify-center">
            <div className="relative">
              <img
                src={previewUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face'}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-4 border-primary-100 dark:border-primary-900 shadow-md"
              />
              <input
                type="file"
                accept={field.accept || 'image/*'}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
                {...register(name, {
                  required: required ? `${label} is required` : false,
                  ...validation
                })}
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    const file = e.target.files[0]
                    const reader = new FileReader()
                    reader.onload = (event) => {
                      const result = event.target.result
                      if (result && typeof result === 'string' && result.startsWith('data:image/')) {
                        setCustomState(prev => ({ ...prev, avatar: result }))
                      }
                    }
                    reader.readAsDataURL(file)
                  }
                }}
              />
              <div className="absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full pointer-events-none shadow-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Click on the image to upload a profile photo
          </p>
          {errors[name] && (
            <p className="text-sm text-red-500 text-center mt-1">{errors[name].message}</p>
          )}
        </div>
      )
    }

    // File upload using FileUpload component
    if (type === 'file' || type === 'files' || type === 'fileupload') {
      const existingFileUrl = initialData?.fileUrl
      const hasExistingFile = isEditMode && existingFileUrl
      const isConditional = field.conditionalRequired
      
      // In edit mode, show indicator if this field has data
      if (isEditMode && isConditional && !inputMode && hasExistingFile) {
        setInputMode(name)
      }
      
      // Hide if user selected the other option
      if (isConditional && inputMode && inputMode !== name) {
        return null
      }
      
      return (
        <div key={name} className="w-full space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label} {required && !hasExistingFile && <span className="text-red-500">*</span>}
              {isEditMode && inputMode === name && hasExistingFile && (
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Active</span>
              )}
            </label>
            {isConditional && !inputMode && (
              <button
                type="button"
                onClick={() => setInputMode(name)}
                className="px-3 py-1 bg-primary-500 text-white text-xs rounded-md hover:bg-primary-600"
              >
                Choose File Upload
              </button>
            )}
          </div>
          
          {hasExistingFile && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm text-blue-800 dark:text-blue-200">Current file: {existingFileUrl.split('/').pop()}</span>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">Upload a new file to replace the existing one</p>
            </div>
          )}
          
          {(!isConditional || inputMode === name) && (
            <FileUpload
              multiple={field.multiple || false}
              onUploadComplete={(results) => {
                console.log('GenericFormModal: Received file from FileUpload:', results)
                setCustomState(prev => ({ ...prev, [name]: results }))
                setValue(name, results)
              }}
              onError={(error) => {
                console.error('Upload error:', error)
                toast.error(error)
              }}
            />
          )}
          {errors[name] && (
            <p className="text-sm text-red-500">{errors[name].message}</p>
          )}
        </div>
      )
    }

    // Date input with icon
    if (type === 'date') {
      return (
        <div key={name} className="w-full space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <input
              type="date"
              className={`w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${errors[name] ? 'border-red-500' : ''}`}
              value={watch(name) || ''}
              {...register(name, {
                required: required ? `${label} is required` : false,
                ...validation
              })}
            />
          </div>
          {errors[name] && (
            <p className="text-sm text-red-500 mt-1">{errors[name].message}</p>
          )}
        </div>
      )
    }

     // Time input with icon
    if (type === 'time') {
      return (
        <div key={name} className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <input
              type="time"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              {...register(name, {
                required: required ? `${label} is required` : false,
                ...validation
              })}
            />
          </div>
          {errors[name] && (
            <p className="text-sm text-red-500">{errors[name].message}</p>
          )}
        </div>
      )
    }
    // Tags input with add/remove functionality
    if (type === 'tags') {
      const tags = customState.tags || []
      const tagInput = customState.tagInput || ''
      
      const addTag = () => {
        const trimmedTag = tagInput.trim()
        if (trimmedTag && trimmedTag.length > 0 && !tags.includes(trimmedTag) && tags.length < 10) {
          const newTags = [...tags, trimmedTag]
          setCustomState(prev => ({ ...prev, tags: newTags, tagInput: '' }))
          setValue(name, newTags)
        }
      }
      
      const removeTag = (tagToRemove) => {
        const newTags = tags.filter(tag => tag !== tagToRemove)
        setCustomState(prev => ({ ...prev, tags: newTags }))
        setValue(name, newTags)
      }
      
      return (
        <div key={name} className="w-full space-y-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <input
                type="text"
                placeholder={placeholder}
                value={tagInput}
                onChange={(e) => setCustomState(prev => ({ ...prev, tagInput: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              />
            </div>
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors text-sm font-medium whitespace-nowrap"
            >
              Add
            </button>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, tagIndex) => (
                <motion.span
                  key={tagIndex}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm font-medium"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-primary-600 dark:hover:text-primary-300 ml-1 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </motion.span>
              ))}
            </div>
          )}
          
          <input
            type="hidden"
            {...register(name)}
            value={JSON.stringify(tags)}
          />
          {errors[name] && (
            <p className="text-sm text-red-500 mt-1">{errors[name].message}</p>
          )}
        </div>
      )
    }

    // Image upload field (for question images)
    if (type === 'image') {
      const imagePreview = customState[`${name}_preview`]
      
      return (
        <div key={name} className="w-full space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept={field.accept || 'image/*'}
              className="hidden"
              id={`${name}-upload`}
              {...register(name)}
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  const file = e.target.files[0]
                  const reader = new FileReader()
                  reader.onload = (event) => {
                    setCustomState(prev => ({ ...prev, [`${name}_preview`]: event.target.result, [name]: file }))
                  }
                  reader.readAsDataURL(file)
                }
              }}
            />
            <label
              htmlFor={`${name}-upload`}
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 cursor-pointer text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Choose Image
            </label>
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="h-12 w-12 object-cover rounded border" />
            )}
          </div>
          {errors[name] && (
            <p className="text-sm text-red-500">{errors[name].message}</p>
          )}
        </div>
      )
    }

    // Array text field (standalone multiple text inputs)
    if (type === 'arrayText') {
      const arrayValues = customState[name] || ['', '', '', '']
      
      const updateArrayValue = (index, value) => {
        const newValues = [...arrayValues]
        newValues[index] = value
        setCustomState(prev => ({ ...prev, [name]: newValues }))
        setValue(name, newValues)
      }
      
      return (
        <div key={name} className="w-full space-y-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          {arrayValues.map((value, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Option ${String.fromCharCode(65 + index)}`}
              value={value}
              onChange={(e) => updateArrayValue(index, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          ))}
          {errors[name] && (
            <p className="text-sm text-red-500">{errors[name].message}</p>
          )}
        </div>
      )
    }

    // Dynamic array field (for question sets)
    if (type === 'array') {
      const arrayItems = customState[name] || [{}]
      const isConditional = field.conditionalRequired
      const hasData = arrayItems.length > 0 && arrayItems.some(item => Object.keys(item).length > 0)
      
      // In edit mode, show indicator if this field has data
      if (isEditMode && isConditional && !inputMode && hasData) {
        setInputMode(name)
      }
      
      // Hide if user selected the other option
      if (isConditional && inputMode && inputMode !== name) {
        return null
      }
      
      const addItem = () => {
        const newItems = [...arrayItems, {}]
        setCustomState(prev => ({ ...prev, [name]: newItems }))
        setValue(name, newItems)
      }
      
      const removeItem = (index) => {
        if (arrayItems.length > 1) {
          const newItems = arrayItems.filter((_, i) => i !== index)
          setCustomState(prev => ({ ...prev, [name]: newItems }))
          setValue(name, newItems)
        }
      }
      
      return (
        <div key={name} className="w-full space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label} {required && <span className="text-red-500">*</span>}
              {isEditMode && inputMode === name && hasData && (
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Active</span>
              )}
            </label>
            <div className="flex gap-2">
              {isConditional && !inputMode && (
                <button
                  type="button"
                  onClick={() => setInputMode(name)}
                  className="px-3 py-1 bg-secondary-500 text-white text-xs rounded-md hover:bg-secondary-600"
                >
                  Choose Question Set
                </button>
              )}
              {(!isConditional || inputMode === name) && (
                <button
                  type="button"
                  onClick={addItem}
                  className="px-3 py-1 bg-primary-500 text-white text-sm rounded-md hover:bg-primary-600 transition-colors"
                >
                  {field.addButtonText || `Add ${label.replace(/s$/, '')}`}
                </button>
              )}
            </div>
          </div>
          
          {(!isConditional || inputMode === name) && arrayItems.map((item, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-800 dark:text-gray-200">{field.itemLabel || label.replace(/s$/, '')} {index + 1}</h4>
                {arrayItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {field.fields?.map((subField) => {
                  const subFieldName = `${name}[${index}].${subField.name}`
                  
                  if (subField.type === 'image') {
                    const existingImageUrl = arrayItems[index]?.imageUrl
                    const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000'
                    const fullImageUrl = existingImageUrl && !existingImageUrl.startsWith('http') && !existingImageUrl.startsWith('data:') 
                      ? `${baseUrl}${existingImageUrl}` 
                      : existingImageUrl
                    const imagePreview = customState[`${name}_${index}_${subField.name}_preview`] || fullImageUrl
                    
                    return (
                      <div key={subField.name} className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {subField.label}
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="file"
                            accept={subField.accept || 'image/*'}
                            className="hidden"
                            id={`${name}-${index}-${subField.name}-upload`}
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                const file = e.target.files[0]
                                const reader = new FileReader()
                                reader.onload = (event) => {
                                  setCustomState(prev => ({ 
                                    ...prev, 
                                    [`${name}_${index}_${subField.name}_preview`]: event.target.result
                                  }))
                                  const newItems = [...arrayItems]
                                  if (!newItems[index]) newItems[index] = {}
                                  newItems[index][subField.name] = file
                                  setCustomState(prev => ({ ...prev, [name]: newItems }))
                                }
                                reader.readAsDataURL(file)
                              }
                            }}
                          />
                          <label
                            htmlFor={`${name}-${index}-${subField.name}-upload`}
                            className="px-3 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 cursor-pointer text-sm flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            {imagePreview ? 'Change Image' : 'Add Image'}
                          </label>
                          {imagePreview && (
                            <div className="relative">
                              <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded border" />
                              <button
                                type="button"
                                onClick={() => {
                                  setCustomState(prev => {
                                    const newState = { ...prev }
                                    delete newState[`${name}_${index}_${subField.name}_preview`]
                                    return newState
                                  })
                                  const newItems = [...arrayItems]
                                  if (newItems[index]) {
                                    delete newItems[index][subField.name]
                                    delete newItems[index].imageUrl
                                  }
                                  setCustomState(prev => ({ ...prev, [name]: newItems }))
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  }
                  
                  if (subField.type === 'arrayText') {
                    const options = customState[`${name}_${index}_options`] || ['', '', '', '']
                    
                    return (
                      <div key={subField.name} className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {subField.label}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {options.map((option, optIndex) => (
                            <input
                              key={optIndex}
                              type="text"
                              placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...options]
                                newOptions[optIndex] = e.target.value
                                setCustomState(prev => ({ 
                                  ...prev, 
                                  [`${name}_${index}_options`]: newOptions 
                                }))
                                // Also update the array item in customState
                                const newItems = [...arrayItems]
                                if (!newItems[index]) newItems[index] = {}
                                newItems[index][subField.name] = newOptions
                                setCustomState(prev => ({ ...prev, [name]: newItems }))
                              }}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                          ))}
                        </div>
                      </div>
                    )
                  }
                  
                  return (
                    <div key={subField.name} className="space-y-1">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {subField.label} {subField.required && <span className="text-red-500">*</span>}
                      </label>
                      {subField.type === 'select' ? (
                        <select
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          value={watch(subFieldName) || arrayItems[index]?.[subField.name] || ''}
                          {...register(subFieldName)}
                          onChange={(e) => {
                            setValue(subFieldName, e.target.value)
                            const newItems = [...arrayItems]
                            if (!newItems[index]) newItems[index] = {}
                            newItems[index][subField.name] = e.target.value
                            setCustomState(prev => ({ ...prev, [name]: newItems }))
                          }}
                        >
                          <option value="">Select {subField.label}</option>
                          {(subField.apiEndpoint ? (dynamicOptions[`${name}_${subField.name}`] || []) : (subField.options || [])).map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={subField.type}
                          placeholder={subField.placeholder}
                          value={watch(subFieldName) || arrayItems[index]?.[subField.name] || ''}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          {...register(subFieldName)}
                          onChange={(e) => {
                            setValue(subFieldName, e.target.value)
                            const newItems = [...arrayItems]
                            if (!newItems[index]) newItems[index] = {}
                            newItems[index][subField.name] = e.target.value
                            setCustomState(prev => ({ ...prev, [name]: newItems }))
                          }}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
          
          {errors[name] && (
            <p className="text-sm text-red-500">{errors[name].message}</p>
          )}
        </div>
      )
    }

    return null
  }

  // Group fields by sections
  const sections = fields.reduce((acc, field) => {
    const section = field.section || 'default'
    if (!acc[section]) acc[section] = []
    acc[section].push(field)
    return acc
  }, {})

  return (
    <ResponsiveFormModal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
    >
      <div className="max-w-4xl mx-auto" key={modalKey}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3 md:space-y-4">
          {Object.entries(sections).map(([sectionName, sectionFields], sectionIndex) => (
            <motion.div
              key={sectionName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-3 md:p-4 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              {sectionName !== 'default' && (
                <h3 className="text-base font-semibold mb-3 md:mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
                  {getSectionIcon(sectionName)}
                  {sectionFields[0]?.sectionTitle || sectionName}
                </h3>
              )}
              
              <div className="form-field-container space-y-3 md:space-y-4">
                {(() => {
                  const rows = []
                  let currentRow = []
                  
                  sectionFields.forEach((field, fieldIndex) => {
                    if (field.newline && currentRow.length > 0) {
                      rows.push(currentRow)
                      currentRow = [field]
                    } else {
                      currentRow.push(field)
                    }
                  })
                  
                  if (currentRow.length > 0) {
                    rows.push(currentRow)
                  }
                  
                  return rows.map((rowFields, rowIndex) => (
                    <div 
                      key={rowIndex}
                      className={`grid gap-3 md:gap-4 ${
                        rowFields.some(f => f.fullWidth) || rowFields.length === 1
                          ? 'grid-cols-1'
                          : 'grid-cols-1 lg:grid-cols-2'
                      }`}
                    >
                      {rowFields.map((field, fieldIndex) => (
                        <div 
                          key={field.name} 
                          className={`w-full min-w-0 ${field.fullWidth ? 'lg:col-span-2' : ''}`}
                        >
                          {renderField(field, fieldIndex)}
                        </div>
                      ))}
                    </div>
                  ))
                })()} 
              </div>
            </motion.div>
          ))}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Object.keys(sections).length * 0.1 }}
            className="flex flex-col-reverse md:flex-row justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-700"
          >
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="min-w-[120px] w-full md:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[120px] w-full md:w-auto"
            >
              {isLoading ? (
                <Loader size="sm" text="" />
              ) : (
                isEditMode ? 'Update' : 'Create'
              )}
            </Button>
          </motion.div>
        </form>
      </div>
    </ResponsiveFormModal>
  )
}

export default GenericFormModal