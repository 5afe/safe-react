import { useState, useEffect } from 'react'
import { useHistory, matchPath } from 'react-router-dom'
import { SafeRouteSlugs, ADDRESSED_ROUTE, SAFE_ADDRESS_SLUG } from 'src/routes/routes'

// Legacy versions of the Safe relied on subdomains and by means of
// a new page load it reset the state of the Safe Container component

// By using a custom key, set based on the address of the safe, we can
// trigger a re-render of the Safe Container depdendent on the address

export const useAddressedRouteKey = (): { key: number } => {
  const [key, setKey] = useState<number>(Date.now())
  const history = useHistory()

  const match = matchPath<SafeRouteSlugs>(history.location.pathname, {
    path: ADDRESSED_ROUTE,
  })
  const prefixedSafeAddress = match?.params?.[SAFE_ADDRESS_SLUG]

  useEffect(() => {
    setKey(Date.now())
  }, [prefixedSafeAddress])

  return { key }
}
