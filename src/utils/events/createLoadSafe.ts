import { ComponentProps } from 'react'

import Track from 'src/components/Track'

export const CREATE_SAFE_CATEGORY = 'safe-creation'
export const CREATE_SAFE_EVENTS: Record<string, Omit<ComponentProps<typeof Track>, 'children' | 'label'>> = {
  CREATE_BUTTON: {
    category: CREATE_SAFE_CATEGORY,
    action: 'Clicked "Create new Safe" button',
  },
  NAME_SAFE: {
    category: CREATE_SAFE_CATEGORY,
    action: 'Set new Safe name',
  },
  OWNERS: {
    category: CREATE_SAFE_CATEGORY,
    action: 'Number of owners',
  },
  THRESHOLD: {
    category: CREATE_SAFE_CATEGORY,
    action: 'Safe threshold',
  },
  CREATED_SAFE: {
    category: CREATE_SAFE_CATEGORY,
    action: 'Successfully created Safe',
  },
  GET_STARTED: {
    category: CREATE_SAFE_CATEGORY,
    action: 'Clicked "Get started" button',
  },
  GO_TO_SAFE: {
    category: CREATE_SAFE_CATEGORY,
    action: 'Navigate to created Safe',
  },
}

export const LOAD_SAFE_CATEGORY = 'safe-load'
export const LOAD_SAFE_EVENTS: Record<string, Omit<ComponentProps<typeof Track>, 'children' | 'label'>> = {
  LOAD_BUTTON: {
    category: LOAD_SAFE_CATEGORY,
    action: 'Clicked "Load Existing Safe" button',
  },
  NAME_SAFE: {
    category: LOAD_SAFE_CATEGORY,
    action: 'Set new Safe name',
  },
  OWNERS: {
    category: LOAD_SAFE_CATEGORY,
    action: 'Number of owners',
  },
  THRESHOLD: {
    category: LOAD_SAFE_CATEGORY,
    action: 'Safe threshold',
  },
  GO_TO_SAFE: {
    category: LOAD_SAFE_CATEGORY,
    action: 'Navigate to loaded Safe',
  },
}
