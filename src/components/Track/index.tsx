import { ReactElement, cloneElement, Fragment } from 'react'
import { getChainInfo } from 'src/config'

type Props = {
  children: ReactElement
  id: string
  payload?: Record<string, string | number | boolean | null>
}

const Track = ({ children, id, payload }: Props): ReactElement => {
  if (children.type === Fragment) {
    throw new Error('Fragments cannot be tracked.')
  }

  const { chainId, shortName } = getChainInfo()

  return cloneElement(children, {
    ...children.props,
    'data-track-id': id,
    'data-track-chain': JSON.stringify({ chainId, shortName }),
    ...(payload !== undefined && { 'data-track-payload': JSON.stringify(payload) }),
  })
}

export default Track
