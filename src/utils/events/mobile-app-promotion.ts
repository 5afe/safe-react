import { GTM_EVENT } from '../googleTagManager'

const event = GTM_EVENT.CLICK
const category = 'mobile-app-promotion'
const surveyAction = 'dashboard-banner-survey'

const MOBILE_APP_EVENTS = {
  dashboardBannerClick: {
    event,
    category,
    action: 'dashboard-banner-click',
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
  dashboardBannerClose: {
    event,
    category,
    action: 'dashboard-banner-close',
  },
  appstoreButtonClick: {
    event,
    category,
    action: 'appstore-button-click',
  },
}

export default MOBILE_APP_EVENTS
