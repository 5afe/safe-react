import { GTM_EVENT } from '../googleTagManager'

const event = GTM_EVENT.CLICK
const category = 'mobile-app-promotion'
const action = 'dashboard-banner'

const MOBILE_APP_EVENTS = {
  alreadyUse: {
    event,
    category,
    action,
    label: 'already-use',
  },
  notInterested: {
    event,
    category,
    action,
    label: 'not-interested',
  },
}

export default MOBILE_APP_EVENTS
