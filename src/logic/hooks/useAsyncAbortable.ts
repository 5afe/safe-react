import { useRef, useEffect, useCallback, useState } from 'react'

export const useAsyncAbortable = <Args extends unknown[], Res extends unknown>(
  asyncFn: (...args: Args) => Promise<Res>,
): {
  abortableFn: (...args: Args) => Promise<Res>
  isLoading: boolean
  abort: () => void | undefined
} => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const abortControllerRef = useRef<AbortController>()

  const asyncWrapper = useCallback(
    async (...args: Args) => {
      // Cancel previous async calls
      abortControllerRef.current?.abort()

      const abortController = new AbortController()
      abortControllerRef.current = abortController

      try {
        setIsLoading(true)

        return await asyncFn(...args)
      } finally {
        setIsLoading(false)

        // Reset abort controller ref
        if (abortControllerRef.current === abortController) {
          abortControllerRef.current = undefined
        }
      }
    },
    [asyncFn],
  )

  // Cleanup async calls on unmount
  useEffect(() => abortControllerRef.current?.abort(), [])

  return {
    abortableFn: (...args) => asyncWrapper(...args),
    isLoading,
    abort: () => abortControllerRef.current?.abort(),
  }
}
