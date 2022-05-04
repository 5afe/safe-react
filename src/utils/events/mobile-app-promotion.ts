import { GTM_EVENT } from '../googleTagManager'

const event = GTM_EVENT.CLICK
const category = 'mobile-app-promotion'
const clickAction = 'dashboard-banner-click'
const surveyAction = 'dashboard-banner-survey'

const MOBILE_APP_EVENTS = {
  dashboardBannerClick: {
    event,
    category,
    action: clickAction,
  },
  alreadyUse: {
    event,
    category,
    action: surveyAction,
    label: 'already-use',
  },
  notInterested: {
    event,
    category,
    action: surveyAction,
    label: 'not-interested',
  },
}

export default MOBILE_APP_EVENTS
