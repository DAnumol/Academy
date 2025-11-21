import { useTheme } from '@hooks/useTheme'

const withTheme = (WrappedComponent) => {
  const WithThemeComponent = (props) => {
    const themeProps = useTheme()

    return <WrappedComponent {...props} theme={themeProps} />
  }

  WithThemeComponent.displayName = `withTheme(${WrappedComponent.displayName || WrappedComponent.name})`
  
  return WithThemeComponent
}

export default withTheme