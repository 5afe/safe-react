import { GTM_EVENT } from 'src/utils/googleTagManager'
import { addEventCategory } from 'src/utils/events/utils'

// Back/forward is automatically tracked in create/load stepper

const CREATE_SAFE = {
  CREATE_BUTTON: {
    event: GTM_EVENT.CLICK,
    action: 'Open stepper',
  },
  NAME_SAFE: {
    event: GTM_EVENT.META,
    action: 'Name Safe',
  },
  OWNERS: {
    event: GTM_EVENT.META,
    action: 'Owners',
  },
  THRESHOLD: {
    event: GTM_EVENT.META,
    action: 'Threshold',
  },
  SUBMIT_CREATE_SAFE: {
    event: GTM_EVENT.META,
    action: 'Submit Safe creation',
  },
  REJECT_CREATE_SAFE: {
    event: GTM_EVENT.META,
    action: 'Reject Safe creation',
  },
  RETRY_CREATE_SAFE: {
    event: GTM_EVENT.META,
    action: 'Retry Safe creation',
  },
  CANCEL_CREATE_SAFE: {
    event: GTM_EVENT.META,
    action: 'Cancel Safe creation',
  },
  CREATED_SAFE: {
    event: GTM_EVENT.META,
    action: 'Created Safe',
  },
  GET_STARTED: {
    event: GTM_EVENT.CLICK,
    action: 'Load Safe',
  },
  GO_TO_SAFE: {
    event: GTM_EVENT.CLICK,
    action: 'Open Safe',
  },
}

export const CREATE_SAFE_CATEGORY = 'create-safe'
export const CREATE_SAFE_EVENTS = addEventCategory(CREATE_SAFE, CREATE_SAFE_CATEGORY)

const LOAD_SAFE = {
  LOAD_BUTTON: {
    event: GTM_EVENT.CLICK,
    action: 'Open stepper',
  },
  NAME_SAFE: {
    event: GTM_EVENT.META,
    action: 'Name Safe',
  },
  OWNERS: {
    event: GTM_EVENT.META,
    action: 'Owners',
  },
  THRESHOLD: {
    event: GTM_EVENT.META,
    action: 'Threshold',
  },
  GO_TO_SAFE: {
    event: GTM_EVENT.CLICK,
    action: 'Open Safe',
  },
}

export const LOAD_SAFE_CATEGORY = 'load-safe'
export const LOAD_SAFE_EVENTS = addEventCategory(LOAD_SAFE, LOAD_SAFE_CATEGORY)
