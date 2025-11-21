import { useTranslation } from '@hooks/useTranslation'

const withInternationalization = (WrappedComponent) => {
  const InternationalizedComponent = (props) => {
    const { t, locale, changeLocale } = useTranslation()

    return (
      <WrappedComponent 
        {...props} 
        t={t}
        locale={locale}
        changeLocale={changeLocale}
      />
    )
  }

  InternationalizedComponent.displayName = `withInternationalization(${WrappedComponent.displayName || WrappedComponent.name})`
  
  return InternationalizedComponent
}

export default withInternationalization