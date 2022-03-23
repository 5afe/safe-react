import { ReactElement, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { WELCOME_ROUTE } from 'src/routes/routes'
import removeViewedSafe from 'src/logic/currentSession/store/actions/removeViewedSafe'
import FetchError from './FetchError'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'

const SafeLoadError = ({ isSafeLoaded }: { isSafeLoaded: boolean }): ReactElement => {
  const dispatch = useDispatch()
  const { address } = useSelector(currentSafeWithNames)

  useEffect(() => {
    // Remove the errorneous Safe from the list of viewed safes on unmount
    return () => {
      if (!isSafeLoaded) {
        dispatch(removeViewedSafe(address))
      }
    }
  }, [dispatch, address, isSafeLoaded])

  return <FetchError text="This Safe couldn't be loaded" buttonText="Back to Main Page" redirectRoute={WELCOME_ROUTE} />
}

export default SafeLoadError
