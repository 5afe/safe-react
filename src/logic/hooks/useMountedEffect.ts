import { useEffect, useRef } from 'react'

/**
 * Identical to React.useEffect, except that it never runs on mount. This is the equivalent of
 * the componentDidUpdate lifecycle function.
 */
const useMountedEffect: typeof useEffect = (effect, dependencies) => {
  const mounted = useRef<boolean>(false)

  useEffect(() => {
    if (mounted.current) {
      const unmount = effect()
      return () => {
        mounted.current = false
        unmount && unmount()
      }
    } else {
      mounted.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)
}

export default useMountedEffect
