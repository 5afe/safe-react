import debounce from 'lodash.debounce'
import { useCallback, useEffect, useState, useRef } from 'react'

/*
  This code snippet is copied from https://github.com/gnbaron/use-lodash-debounce
  with the sole intention to be able to tweak it if is needed and prevent from having
  a new dependency for something relatively trivial
*/

interface DebounceOptions {
  leading: boolean
  maxWait: number
  trailing: boolean
}

export const useDebouncedCallback = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay = 0,
  options?: DebounceOptions,
): T & { cancel: () => void } => useCallback(debounce(callback, delay, options), [callback, delay, options])

export const useDebounce = <T extends unknown>(value: T, delay = 0, options?: DebounceOptions): T => {
  const previousValue = useRef(value)
  const [current, setCurrent] = useState(value)
  const debouncedCallback = useDebouncedCallback((value: T) => setCurrent(value), delay, options)

  useEffect(() => {
    // does trigger the debounce timer initially
    if (value !== previousValue.current) {
      debouncedCallback(value)
      previousValue.current = value
      // cancel the debounced callback on clean up
      return debouncedCallback.cancel
    }
  }, [debouncedCallback, value])

  return current
}
