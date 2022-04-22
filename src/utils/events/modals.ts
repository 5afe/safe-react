import { GTM_EVENT } from 'src/utils/googleTagManager'
import { addEventCategory, TrackEvent } from 'src/utils/events/utils'

const MODALS = {
  SEND_FUNDS: {
    event: GTM_EVENT.CLICK,
    action: 'Send funds',
  },
  SEND_COLLECTIBLE: {
    event: GTM_EVENT.CLICK,
    action: 'Send collectible',
  },
  CONTRACT_INTERACTION: {
    event: GTM_EVENT.CLICK,
    action: 'Contract interaction',
  },
  ADVANCED_PARAMS: {
    event: GTM_EVENT.CLICK,
    action: 'Advanced params',
  },
  EDIT_ADVANCED_PARAMS: {
    event: GTM_EVENT.CLICK,
    action: 'Edit advanced params',
  },
  ESTIMATION: {
    event: GTM_EVENT.CLICK,
    action: 'Estimation',
  },
  EDIT_ESTIMATION: {
    event: GTM_EVENT.CLICK,
    action: 'Edit estimation',
  },
  EXECUTE_TX: {
    event: GTM_EVENT.CLICK,
    action: 'Execute transaction',
  },
  USE_SPENDING_LIMIT: {
    event: GTM_EVENT.META,
    action: 'Use spending limit',
  },
}

const MODALS_CATEGORY = 'modals'

// Modal.Footer.Buttons buttons automatically generate events from button strings
// which can be used as reference for 'finalising' a modal form, e.g.
// we do not need to track: add owner => owner added, just add owner

export const getModalEvent = (action: string, event = GTM_EVENT.CLICK): TrackEvent => ({
  event,
  category: MODALS_CATEGORY,
  action,
})

export const MODALS_EVENTS = addEventCategory(MODALS, MODALS_CATEGORY)
