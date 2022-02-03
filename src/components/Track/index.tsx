import { ReactElement, cloneElement, Fragment } from 'react'

type Props = {
  children: ReactElement
  id: string
  payload?: Record<string, string | number | boolean | null>
}

const Track = ({ children, id, payload }: Props): ReactElement => {
  if (children.type === Fragment) {
    throw new Error('Fragments cannot be tracked.')
  }

  return cloneElement(children, {
    ...children.props,
    'data-track-id': id,
    ...(payload !== undefined && { 'data-track-payload': JSON.stringify(payload) }),
  })
}

export default Track
