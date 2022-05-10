import { ReactElement } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { WELCOME_ROUTE } from 'src/routes/routes'
import removeViewedSafe from 'src/logic/currentSession/store/actions/removeViewedSafe'
import FetchError from './FetchError'
import { currentSafe } from 'src/logic/safe/store/selectors'

const SafeLoadError = (): ReactElement => {
  const dispatch = useDispatch()

  const { address } = useSelector(currentSafe)
  const onClick = () => dispatch(removeViewedSafe(address))

  return (
    <FetchError
      text="This Safe couldn't be loaded"
      buttonText="Back to Main Page"
      redirectRoute={WELCOME_ROUTE}
      onClick={onClick}
    />
  )
}

export default SafeLoadError
