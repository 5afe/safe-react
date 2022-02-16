import { ReactElement, useEffect } from 'react'
import { extractSafeAddress, WELCOME_ROUTE } from 'src/routes/routes'
import { useDispatch } from 'react-redux'
import removeViewedSafe from 'src/logic/currentSession/store/actions/removeViewedSafe'
import FetchError from './FetchError'

const SafeLoadError = (): ReactElement => {
  const dispatch = useDispatch()

  useEffect(() => {
    // Remove the errorneous Safe from the list of viewed safes on unmount
    return () => {
      dispatch(removeViewedSafe(extractSafeAddress()))
    }
  }, [dispatch])

  return <FetchError text="This Safe couldn't be loaded" buttonText="Back to Main Page" redirectRoute={WELCOME_ROUTE} />
}

export default SafeLoadError
