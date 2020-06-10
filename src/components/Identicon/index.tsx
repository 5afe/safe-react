import * as React from 'react'

import makeBlockie from 'ethereum-blockies-base64'
import { useEffect, useState } from 'react'

type Props = {
  address: string
  className?: string
  diameter: number
}

type StyleProps = {
  width: number
  height: number
}

const getStyleFrom = (diameter: number): StyleProps => ({
  width: diameter,
  height: diameter,
})

const generateBlockieIdenticon = (address: string, diameter: number): HTMLImageElement => {
  const image = new window.Image()
  image.src = makeBlockie(address)
  image.height = diameter
  image.width = diameter
  image.style.borderRadius = `${diameter / 2}px`

  return image
}

const Identicon = (props: Props) => {
  const { address, diameter, className } = props
  const style: StyleProps = getStyleFrom(diameter)

  const [identicon, setIdenticon] = useState(null)

  useEffect(() => {
    setIdenticon(React.createRef<HTMLImageElement>())
  }, [])

  useEffect(() => {
    const image = generateBlockieIdenticon(address, diameter)

    if (!identicon || !identicon.current) {
      return
    }

    const { children } = identicon.current
    for (let i = 0; i < children.length; i += 1) {
      identicon.current.removeChild(children[i])
    }

    identicon.current.appendChild(image)
  }, [address, diameter, identicon])

  return <div className={className} ref={identicon} style={style} />
}

export default Identicon
