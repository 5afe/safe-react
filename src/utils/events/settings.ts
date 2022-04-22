import { GTM_EVENT } from 'src/utils/googleTagManager'
import { addEventCategory } from 'src/utils/events/utils'

const SETTINGS = {
  DETAILS: {
    SAFE_NAME: {
      event: GTM_EVENT.CLICK,
      action: 'Name Safe',
    },
  },
  APPEARANCE: {
    PREPEND_PREFIXES: {
      event: GTM_EVENT.CLICK,
      action: 'Prepend EIP-3770 prefixes',
    },
    COPY_PREFIXES: {
      event: GTM_EVENT.CLICK,
      action: 'Copy EIP-3770 prefixes',
    },
    INVERT_COLORS: {
      event: GTM_EVENT.CLICK,
      action: 'Invert colors',
    },
  },
  OWNERS: {
    REMOVE_SAFE: {
      event: GTM_EVENT.CLICK,
      action: 'Remove Safe',
    },
    ADD_OWNER: {
      event: GTM_EVENT.CLICK,
      action: 'Add owner',
    },
    EDIT_OWNER: {
      event: GTM_EVENT.CLICK,
      action: 'Edit owner',
    },
    REPLACE_OWNER: {
      event: GTM_EVENT.CLICK,
      action: 'Replace owner',
    },
    REMOVE_OWNER: {
      event: GTM_EVENT.CLICK,
      action: 'Remove owner',
    },
  },
  THRESHOLD: {
    CHANGE: {
      event: GTM_EVENT.CLICK,
      action: 'Change threshold',
    },
    OWNERS: {
      event: GTM_EVENT.META,
      action: 'Owners',
    },
    THRESHOLD: {
      event: GTM_EVENT.META,
      action: 'Threshold',
    },
  },
  SPENDING_LIMIT: {
    NEW_LIMIT: {
      event: GTM_EVENT.CLICK,
      action: 'New spending limit',
    },
    RESET_PERIOD: {
      event: GTM_EVENT.META,
      action: 'Spending limit reset period',
    },
    REMOVE_LIMIT: {
      event: GTM_EVENT.CLICK,
      action: 'Remove spending limit',
    },
    LIMIT_REMOVED: {
      event: GTM_EVENT.CLICK,
      action: 'Spending limit removed',
    },
  },
}

const SETTINGS_CATEGORY = 'settings'
export const SETTINGS_EVENTS: Record<string, ReturnType<typeof addEventCategory>> = Object.entries(SETTINGS).reduce(
  (settings, [key, value]) => ({ ...settings, [key]: addEventCategory(value, SETTINGS_CATEGORY) }),
  {},
)
