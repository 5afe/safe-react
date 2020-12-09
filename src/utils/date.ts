import { formatRelative } from 'date-fns'

export const relativeTime = (baseTimeMin: string, resetTimeMin: string): string => {
  if (resetTimeMin === '0') {
    return 'One-time'
  }

  const baseTimeSeconds = +baseTimeMin * 60
  const resetTimeSeconds = +resetTimeMin * 60
  const nextResetTimeMilliseconds = (baseTimeSeconds + resetTimeSeconds) * 1000

  return formatRelative(nextResetTimeMilliseconds, Date.now())
}
