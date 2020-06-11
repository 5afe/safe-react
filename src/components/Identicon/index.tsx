import * as React from 'react'

import makeBlockie from 'ethereum-blockies-base64'

type Props = {
  address: string
  className?: string
  diameter: number
}

type StyleProps = {
  width: number
  height: number
  borderRadius: string
}

const getStyleFrom = (diameter: number): StyleProps => ({
  width: diameter,
  height: diameter,
  borderRadius: `${diameter / 2}px`,
})

const Identicon = (props: Props) => {
  const { address, diameter } = props
  const style: StyleProps = getStyleFrom(diameter)

  const iconSrc = React.useMemo(() => makeBlockie(address), [address])

  return <img src={iconSrc} style={style} {...props} />
}

export default Identicon
