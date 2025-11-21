import { useLoading } from '@/context/LoadingContext'
import LoadingSpinner from '@components/common/LoadingSpinner'

const withLoading = (WrappedComponent, loadingProps = {}) => {
  const WithLoadingComponent = (props) => {
    const { isLoading } = useLoading()

    if (isLoading && loadingProps.showGlobalLoading !== false) {
      return <LoadingSpinner {...loadingProps} />
    }

    return <WrappedComponent {...props} />
  }

  WithLoadingComponent.displayName = `withLoading(${WrappedComponent.displayName || WrappedComponent.name})`
  
  return WithLoadingComponent
}

export default withLoading