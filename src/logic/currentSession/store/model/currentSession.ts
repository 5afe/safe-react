import { Record } from 'immutable'

export type SerializedSessionState = {
  viewedSafes: string[]
}

export const makeCurrentSession = Record<SerializedSessionState>({
  viewedSafes: [],
})
