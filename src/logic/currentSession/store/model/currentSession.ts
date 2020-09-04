import { Record } from 'immutable'

type SessionProps = {
  viewedSafes: string[]
}

export const makeCurrentSession = Record<SessionProps>({
  viewedSafes: [],
})
