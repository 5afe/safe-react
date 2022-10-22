import { useEffect, useState, ReactElement } from 'react'
import CantoLogo from '../assets/transition-logo.gif'

const useInterval = (delay: number): number => {
  const [count, setCount] = useState<number>(0)

  useEffect(() => {
    const id = setInterval(() => {
      setCount((prev) => prev + 1)
    }, delay)

    return () => clearInterval(id)
  }, [delay])

  return count
}

const AnimatedLogo = (): ReactElement => {
  const RESTART_DELAY = 2 * 60e3 // 2 minutes
  const restartKey = useInterval(RESTART_DELAY)

  return <img alt="Safe" src={`${CantoLogo}?${restartKey}`} id="safe-logo" height={36} />
}

export default AnimatedLogo
