import { useEffect, useState } from 'react'

type AsyncResult<T> = {
  error: Error | undefined
  result: T | undefined
}

const useAsync = <T>(asyncCall: () => Promise<T>): AsyncResult<T> => {
  const [asyncVal, setAsyncVal] = useState<T>()
  const [err, setErr] = useState<Error>()

  useEffect(() => {
    let isCurrent = true

    setAsyncVal(undefined)
    setErr(undefined)

    asyncCall()
      .then((val: T) => {
        if (isCurrent) setAsyncVal(val)
      })
      .catch((error) => {
        if (isCurrent) setErr(error)
      })

    return () => {
      isCurrent = false
    }
  }, [asyncCall])

  return { error: err, result: asyncVal }
}

export default useAsync
