import { ReactElement, Fragment } from 'react'

import { GTM_EVENT, trackEvent } from 'src/utils/googleTagManager'

type Props = {
  children: ReactElement
  category: string
  action: string // key
  label?: string | number | boolean // value
}

const Track = ({ children, ...trackData }: Props): typeof children => {
  if (children.type === Fragment) {
    throw new Error('Fragments cannot be tracked.')
  }

  const event = {
    event: GTM_EVENT.CLICK,
    ...trackData,
  }

  return (
    <div data-track={`${event.category}: ${event.action}`} onClick={() => trackEvent(event)}>
      {children}
    </div>
  )
}

export default Track
