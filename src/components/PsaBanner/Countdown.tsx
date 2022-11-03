import { ReactElement, useEffect, useState } from 'react'

const Countdown = ({
  children,
  seconds,
  onEnd,
}: {
  children: (count: ReactElement) => ReactElement
  seconds: number
  onEnd: () => void
}): ReactElement | null => {
  const [countdown, setCountdown] = useState<number>(seconds)
  const [cancel, setCancel] = useState<boolean>(false)

  useEffect(() => {
    if (cancel) return

    const interval = setInterval(() => {
      if (cancel) {
        clearInterval(interval)
        return
      }

      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          clearInterval(interval)
          onEnd()
        }

        return prevCountdown - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [onEnd, cancel])

  return cancel ? null : (
    <>
      {children(<span style={{ display: 'inline-block', width: '1em' }}>{countdown}</span>)}{' '}
      <a onClick={() => setCancel(true)}>Cancel</a>
    </>
  )
}

export default Countdown
