import { ReactElement, cloneElement } from 'react'

const TRACK_ID_PROP = 'data-track-id'
const TRACK_PAYLOAD_PROP = 'data-track-payload'

type Props = {
  children: ReactElement
  [TRACK_ID_PROP]: string
  [TRACK_PAYLOAD_PROP]: unknown
}

const Track = ({ children, [TRACK_ID_PROP]: trackId, [TRACK_PAYLOAD_PROP]: trackPayload }: Props): ReactElement => {
  return cloneElement(children, {
    ...children.props,
    [TRACK_ID_PROP]: trackId,
    [TRACK_PAYLOAD_PROP]: JSON.stringify(trackPayload),
  })
}

export default Track
