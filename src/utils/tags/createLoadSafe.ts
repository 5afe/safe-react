import { ComponentProps } from 'react'

import Track from 'src/components/Track'

type TrackingEvents = Record<string, Omit<ComponentProps<typeof Track>, 'children'>>

export const CREATE_SAFE_TRACKING_ID = 'safe-creation'
export const CREATE_SAFE_TRACKING_EVENTS: TrackingEvents = {
  NAME: {
    id: CREATE_SAFE_TRACKING_ID,
    desc: 'Set name',
  },
  // Manual tracking events:
  CREATE: {
    id: CREATE_SAFE_TRACKING_ID,
    desc: 'Create',
  },
}

export const LOAD_SAFE_TRACKING_ID = 'safe-load'
export const LOAD_SAFE_TRACKING_EVENTS: TrackingEvents = {
  NAME: {
    id: LOAD_SAFE_TRACKING_ID,
    desc: 'Set name',
  },
  // Manual tracking events:
  CREATE: {
    id: LOAD_SAFE_TRACKING_ID,
    desc: 'Load',
  },
}
