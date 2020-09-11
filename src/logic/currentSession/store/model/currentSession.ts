import { Record } from 'immutable'

export type CurrentSessionState = {
  viewedSafes: string[]
}

export const makeCurrentSession = Record<CurrentSessionState>({
  viewedSafes: [],
})
