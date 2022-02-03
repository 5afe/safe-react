import { ReactElement, cloneElement } from 'react'

const id = 'data-track-id'
const payload = 'data-track-payload'

type Props = {
  children: ReactElement
  [id]: string
  [payload]: Record<string, string | number | boolean | null>
}

const Track = ({ children, [id]: trackId, [payload]: trackPayload }: Props): ReactElement => {
  return cloneElement(children, {
    ...children.props,
    [id]: trackId,
    ...(trackPayload !== undefined && { [payload]: JSON.stringify(trackPayload) }),
  })
}

export default Track
