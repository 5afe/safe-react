import { useRef, useEffect, useState } from 'react'

type AsyncFn = (...args: unknown[]) => Promise<unknown>

export const useAsyncAbortable = <T extends AsyncFn>(
  asyncFn: T,
): {
  abortableFn: (...args: Parameters<T>) => Promise<ReturnType<T>>
  isLoading: boolean
  abort: () => void | undefined
} => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const abortControllerRef = useRef<AbortController>()

  const abort = () => abortControllerRef.current?.abort()

  const abortableFn = async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    try {
      setIsLoading(true)
      return await asyncFn(...args)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(abort, [])

  return {
    isLoading,
    abort,
    abortableFn,
  }
}
