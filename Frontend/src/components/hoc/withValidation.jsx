import { useState, useCallback } from 'react'

const withValidation = (WrappedComponent, validationSchema = {}) => {
  const WithValidationComponent = (props) => {
    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})

    const validate = useCallback((values) => {
      const newErrors = {}
      
      Object.keys(validationSchema).forEach(field => {
        const rules = validationSchema[field]
        const value = values[field]

        if (rules.required && (!value || value.toString().trim() === '')) {
          newErrors[field] = rules.required.message || `${field} is required`
          return
        }

        if (value && rules.minLength && value.length < rules.minLength.value) {
          newErrors[field] = rules.minLength.message || `${field} must be at least ${rules.minLength.value} characters`
          return
        }

        if (value && rules.maxLength && value.length > rules.maxLength.value) {
          newErrors[field] = rules.maxLength.message || `${field} must be no more than ${rules.maxLength.value} characters`
          return
        }

        if (value && rules.pattern && !rules.pattern.value.test(value)) {
          newErrors[field] = rules.pattern.message || `${field} format is invalid`
          return
        }

        if (rules.custom && typeof rules.custom === 'function') {
          const customError = rules.custom(value, values)
          if (customError) {
            newErrors[field] = customError
          }
        }
      })

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }, [])

    const handleBlur = useCallback((field) => {
      setTouched(prev => ({ ...prev, [field]: true }))
    }, [])

    const validationProps = {
      validate,
      errors,
      touched,
      handleBlur,
      isValid: Object.keys(errors).length === 0
    }

    return <WrappedComponent {...props} validation={validationProps} />
  }

  WithValidationComponent.displayName = `withValidation(${WrappedComponent.displayName || WrappedComponent.name})`
  
  return WithValidationComponent
}

export default withValidation