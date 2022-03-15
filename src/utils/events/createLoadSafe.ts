import { GTM_EVENT, trackEvent } from 'src/utils/googleTagManager'

// Legacy GA events encapsulated the entire stepper under 'Created a Safe'
export const CREATE_SAFE_CATEGORY = 'safe-creation'
export const CREATE_SAFE_EVENTS: Record<string, Parameters<typeof trackEvent>[0]> = {
  CREATE_BUTTON: {
    event: GTM_EVENT.CLICK,
    category: CREATE_SAFE_CATEGORY,
    action: 'Open stepper',
  },
  NAME_SAFE: {
    event: GTM_EVENT.META,
    category: CREATE_SAFE_CATEGORY,
    action: 'Name Safe',
  },
  OWNERS: {
    event: GTM_EVENT.META,
    category: CREATE_SAFE_CATEGORY,
    action: 'Owners',
  },
  THRESHOLD: {
    event: GTM_EVENT.META,
    category: CREATE_SAFE_CATEGORY,
    action: 'Threshold',
  },
  CREATED_SAFE: {
    event: GTM_EVENT.META,
    category: CREATE_SAFE_CATEGORY,
    action: 'Created Safe',
  },
  GET_STARTED: {
    event: GTM_EVENT.CLICK,
    category: CREATE_SAFE_CATEGORY,
    action: 'Load Safe',
  },
  GO_TO_SAFE: {
    event: GTM_EVENT.CLICK,
    category: CREATE_SAFE_CATEGORY,
    action: 'Open Safe',
  },
}

export const LOAD_SAFE_CATEGORY = 'safe-load'
export const LOAD_SAFE_EVENTS: Record<string, Parameters<typeof trackEvent>[0]> = {
  LOAD_BUTTON: {
    event: GTM_EVENT.CLICK,
    category: LOAD_SAFE_CATEGORY,
    action: 'Open stepper',
  },
  NAME_SAFE: {
    event: GTM_EVENT.META,
    category: LOAD_SAFE_CATEGORY,
    action: 'Name Safe',
  },
  OWNERS: {
    event: GTM_EVENT.META,
    category: LOAD_SAFE_CATEGORY,
    action: 'Owners',
  },
  THRESHOLD: {
    event: GTM_EVENT.META,
    category: LOAD_SAFE_CATEGORY,
    action: 'Threshold',
  },
  GO_TO_SAFE: {
    event: GTM_EVENT.CLICK,
    category: LOAD_SAFE_CATEGORY,
    action: 'Open Safe',
  },
}
