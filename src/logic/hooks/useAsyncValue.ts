import { useState, useEffect } from 'react'

// Initial dependencies must be ordered according to the args of asyncCall
const useAsyncValue = <T>(
  asyncCall: (...deps: unknown[]) => Promise<T>,
  getDeps: () => Parameters<typeof asyncCall>,
): [T | undefined, Error | undefined] => {
  const [asyncVal, setAsyncVal] = useState<T>()
  const [err, setErr] = useState<Error>()

  const deps = getDeps()

  useEffect(() => {
    let isCurrent = true

    asyncCall(...deps)
      .then((val: T) => {
        if (isCurrent) setAsyncVal(val)
      })
      .catch(setErr)

    return () => {
      isCurrent = false
    }
  }, [asyncCall, ...deps])

  return [asyncVal, err]
}

export default useAsyncValue
