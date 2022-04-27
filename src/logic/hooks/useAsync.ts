import { useEffect, useState } from 'react'

type AsyncResult<T> = {
  error: Error | undefined
  result: T | undefined
  isLoading: boolean
}

const useAsync = <T>(asyncCall: () => Promise<T>): AsyncResult<T> => {
  const [result, setResult] = useState<T>()
  const [error, setError] = useState<Error>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    let isCurrent = true

    setResult(undefined)
    setError(undefined)
    setIsLoading(true)

    asyncCall()
      .then((val: T) => {
        if (isCurrent) {
          setResult(val)
        }
      })
      .catch((err: Error) => {
        if (isCurrent) {
          setError(err)
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false)
        }
      })

    return () => {
      isCurrent = false
    }
  }, [asyncCall])

  return { error, result, isLoading }
}

export default useAsync
