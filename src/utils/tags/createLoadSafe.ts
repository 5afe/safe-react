import { TrackingEvents } from 'src/components/Track'

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
