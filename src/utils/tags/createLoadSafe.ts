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
  CONFIRM: {
    id: CREATE_SAFE_TRACKING_ID,
    desc: 'Confirm Safe creation',
  },
  GET_STARTED: {
    id: CREATE_SAFE_TRACKING_ID,
    desc: 'Loading created Safe',
  },
  GO_TO_SAFE: {
    id: CREATE_SAFE_TRACKING_ID,
    desc: 'Navigate to created Safe',
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

export const SAFE_OVERVIEW_TRACKING_ID = 'safe-overview'
export const SAFE_OVERVIEW_TRACKING_EVENTS: TrackingEvents = {
  HOME: {
    id: SAFE_OVERVIEW_TRACKING_ID,
    desc: 'Go to Welcome page',
  },
  SHOW_QR: {
    id: SAFE_OVERVIEW_TRACKING_ID,
    desc: 'Show Safe QR code',
  },
  COPY_ADDRESS: {
    id: SAFE_OVERVIEW_TRACKING_ID,
    desc: 'Copy Safe address',
  },
  OPEN_EXPLORER: {
    id: SAFE_OVERVIEW_TRACKING_ID,
    desc: 'Show Safe on block explorer',
  },
  HELP_CENTER: {
    id: SAFE_OVERVIEW_TRACKING_ID,
    desc: 'Open help center',
  },
  OPEN_CURRENCY_MENU: {
    id: SAFE_OVERVIEW_TRACKING_ID,
    desc: 'Open currency menu',
  },
  OPEN_INTERCOM: {
    id: SAFE_OVERVIEW_TRACKING_ID,
    desc: 'Open Intercom',
  },
}
