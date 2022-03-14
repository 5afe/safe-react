import { GTM_EVENT, trackEvent } from 'src/utils/googleTagManager'

export const CREATE_SAFE_CATEGORY = 'safe-creation'
export const CREATE_SAFE_EVENTS: Record<string, Parameters<typeof trackEvent>[0]> = {
  CREATE_BUTTON: {
    event: GTM_EVENT.CLICK,
    category: CREATE_SAFE_CATEGORY,
    action: 'Clicked "Create new Safe" button',
  },
  NAME_SAFE: {
    event: GTM_EVENT.META,
    category: CREATE_SAFE_CATEGORY,
    action: 'Set new Safe name',
  },
  OWNERS: {
    event: GTM_EVENT.META,
    category: CREATE_SAFE_CATEGORY,
    action: 'Number of owners',
  },
  THRESHOLD: {
    event: GTM_EVENT.META,
    category: CREATE_SAFE_CATEGORY,
    action: 'Safe threshold',
  },
  CREATED_SAFE: {
    event: GTM_EVENT.META,
    category: CREATE_SAFE_CATEGORY,
    action: 'Successfully created Safe',
  },
  GET_STARTED: {
    event: GTM_EVENT.CLICK,
    category: CREATE_SAFE_CATEGORY,
    action: 'Clicked "Get started" button',
  },
  GO_TO_SAFE: {
    event: GTM_EVENT.CLICK,
    category: CREATE_SAFE_CATEGORY,
    action: 'Navigate to created Safe',
  },
}

export const LOAD_SAFE_CATEGORY = 'safe-load'
export const LOAD_SAFE_EVENTS: Record<string, Parameters<typeof trackEvent>[0]> = {
  LOAD_BUTTON: {
    event: GTM_EVENT.CLICK,
    category: LOAD_SAFE_CATEGORY,
    action: 'Clicked "Load Existing Safe" button',
  },
  NAME_SAFE: {
    event: GTM_EVENT.META,
    category: LOAD_SAFE_CATEGORY,
    action: 'Set new Safe name',
  },
  OWNERS: {
    event: GTM_EVENT.META,
    category: LOAD_SAFE_CATEGORY,
    action: 'Number of owners',
  },
  THRESHOLD: {
    event: GTM_EVENT.META,
    category: LOAD_SAFE_CATEGORY,
    action: 'Safe threshold',
  },
  GO_TO_SAFE: {
    event: GTM_EVENT.CLICK,
    category: LOAD_SAFE_CATEGORY,
    action: 'Navigate to loaded Safe',
  },
}
