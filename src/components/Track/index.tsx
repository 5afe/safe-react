import { ReactElement, Fragment, useEffect, useRef } from 'react'

import { GTM_EVENT, trackEvent } from 'src/utils/googleTagManager'

type Props = {
  children: ReactElement
  category: string
  action: string // key
  label?: string | number | boolean // value
}

const Track = ({ children, ...trackData }: Props): typeof children => {
  const el = useRef<HTMLDivElement>(null)

  const event: Parameters<typeof trackEvent>[0] = {
    event: GTM_EVENT.CLICK,
    ...trackData,
  }

  useEffect(() => {
    const handleClick = () => trackEvent(event)

    // We cannot use onClick as events in children do not always bubble up
    el.current?.addEventListener('click', handleClick)
    return el.current?.removeEventListener('click', handleClick)
  }, [event, el.current])

  if (children.type === Fragment) {
    throw new Error('Fragments cannot be tracked.')
  }

  return (
    <div data-track={`${event.category}: ${event.action}`} ref={el}>
      {children}
    </div>
  )
}

export default Track
