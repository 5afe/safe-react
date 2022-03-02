import { TrackingEvents } from 'src/components/Track'

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
