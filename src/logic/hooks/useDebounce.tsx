import debounce from 'lodash/debounce'
import { useMemo, useEffect, useState, useRef } from 'react'

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

export const useDebounce = <T extends unknown>(value: T, delay = 0, options?: DebounceOptions): T => {
  const previousValue = useRef(value)
  const [current, setCurrent] = useState(value)
  const debouncedCallback = useMemo(
    () => debounce((val: T) => setCurrent(val), delay, options),
    [setCurrent, delay, options],
  )

  useEffect(() => {
    // does trigger the debounce timer initially
    if (value !== previousValue.current) {
      debouncedCallback(value)
      previousValue.current = value
      // cancel the debounced callback on clean up
      return debouncedCallback.cancel
    }
  }, [debouncedCallback, value, previousValue])

  return current
}
