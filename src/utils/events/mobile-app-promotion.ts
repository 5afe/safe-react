import { GTM_EVENT } from '../googleTagManager'

const MOBILE_APP_EVENTS = {
  appstoreButtonClick: {
    event: GTM_EVENT.CLICK,
    category: 'mobile-app-promotion',
    action: 'appstore-button-click',
  },
}

export default MOBILE_APP_EVENTS
