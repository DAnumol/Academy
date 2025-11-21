import ErrorBoundary from '@components/common/ErrorBoundary'

const withErrorBoundary = (WrappedComponent, errorFallback) => {
  const WithErrorBoundaryComponent = (props) => (
    <ErrorBoundary fallback={errorFallback}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  )

  WithErrorBoundaryComponent.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`
  
  return WithErrorBoundaryComponent
}

export default withErrorBoundary