import { ReactElement, cloneElement, Fragment } from 'react'
import { getChainInfo } from 'src/config'

type Props = {
  children: ReactElement
  id: string
  desc: string
  payload?: Record<string, string | number | boolean | null>
}

const TRACK_PROPS = {
  ID: 'data-track-id',
  DESC: 'data-track-desc',
  CHAIN: 'data-track-chain',
  PAYLOAD: 'data-track-payload',
}

const Track = ({ children, id, desc, payload }: Props): typeof children => {
  if (children.type === Fragment) {
    throw new Error('Fragments cannot be tracked.')
  }

  const { chainId, shortName } = getChainInfo()

  return cloneElement(children, {
    ...children.props,
    [TRACK_PROPS.ID]: id,
    [TRACK_PROPS.DESC]: desc,
    [TRACK_PROPS.CHAIN]: JSON.stringify({ chainId, shortName }),
    ...(payload !== undefined && { [TRACK_PROPS.PAYLOAD]: JSON.stringify(payload) }),
  })
}

export default Track
