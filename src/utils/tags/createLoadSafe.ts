import { ComponentProps } from 'react'

import Track from 'src/components/Track'

type TrackingEvents = Record<string, Omit<ComponentProps<typeof Track>, 'children'>>

export const CREATE_SAFE_TRACKING_ID = 'safe-creation'
export const CREATE_SAFE_TRACKING_EVENTS: TrackingEvents = {
  WELCOME: {
    id: CREATE_SAFE_TRACKING_ID,
    desc: 'Start Safe creation',
  },
  NAME: {
    id: CREATE_SAFE_TRACKING_ID,
    desc: 'Set new Safe name',
  },
  // Manual tracking events:
  CREATE: {
    id: CREATE_SAFE_TRACKING_ID,
    desc: 'Create Safe',
  },
}

export const LOAD_SAFE_TRACKING_ID = 'safe-load'
export const LOAD_SAFE_TRACKING_EVENTS: TrackingEvents = {
  WELCOME: {
    id: LOAD_SAFE_TRACKING_ID,
    desc: 'Load existing Safe',
  },
  NAME: {
    id: LOAD_SAFE_TRACKING_ID,
    desc: 'Set existing Safe name',
  },
  // Manual tracking events:
  LOAD: {
    id: LOAD_SAFE_TRACKING_ID,
    desc: 'Load Safe',
  },
}
