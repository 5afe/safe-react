import { ReactElement, Fragment } from 'react'

import { getTrackDataLayer } from 'src/utils/googleTagManager'

type Props = {
  children: ReactElement
  id: string
  desc: string
  payload?: Record<string, string | number | boolean | null>
}

const Track = ({ children, ...trackData }: Props): typeof children => {
  if (children.type === Fragment) {
    throw new Error('Fragments cannot be tracked.')
  }

  return <div {...getTrackDataLayer(trackData)}>{children}</div>
}

export default Track
