import { ComponentProps } from 'react'

import Track from 'src/components/Track'

export const SAFE_OVERVIEW_CATEGORY = 'safe-overview'
export const SAFE_OVERVIEW_EVENTS: Record<string, Omit<ComponentProps<typeof Track>, 'children' | 'label'>> = {
  HOME: {
    category: SAFE_OVERVIEW_CATEGORY,
    action: 'Go to Welcome page',
  },
  OPEN_CURRENCY_MENU: {
    category: SAFE_OVERVIEW_CATEGORY,
    action: 'Open currency menu',
  },
  CHANGE_CURRENCY: {
    category: SAFE_OVERVIEW_CATEGORY,
    action: 'Change currency',
  },
  OPEN_INTERCOM: {
    category: SAFE_OVERVIEW_CATEGORY,
    action: 'Open Intercom',
  },
  HELP_CENTER: {
    category: SAFE_OVERVIEW_CATEGORY,
    action: 'Open Help Center',
  },
  SHOW_QR: {
    category: SAFE_OVERVIEW_CATEGORY,
    action: 'Show Safe QR code',
  },
  COPY_ADDRESS: {
    category: SAFE_OVERVIEW_CATEGORY,
    action: 'Copy Safe address',
  },
  OPEN_EXPLORER: {
    category: SAFE_OVERVIEW_CATEGORY,
    action: 'Open Safe on block explorer',
  },
}
