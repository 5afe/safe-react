import * as React from 'react'

import makeBlockie from 'ethereum-blockies-base64'

type Props = {
  address: string
  className: string
  diameter: number
}

type StyleProps = {
  width: number
  height: number
}

export default class Identicon extends React.PureComponent<any> {
  private identicon: React.RefObject<HTMLImageElement>

  static defaultProps = {
    className: '',
  }

  constructor(props: Props) {
    super(props)

    this.identicon = React.createRef<HTMLImageElement>()
  }

  componentDidMount = (): void => {
    const { address, diameter } = this.props
    const image = this.generateBlockieIdenticon(address, diameter)
    if (this.identicon.current) {
      this.identicon.current.appendChild(image)
    }
  }

  componentDidUpdate = (): void => {
    const { address, diameter } = this.props
    const image = this.generateBlockieIdenticon(address, diameter)

    if (!this.identicon.current) {
      return
    }

    const { children } = this.identicon.current
    for (let i = 0; i < children.length; i += 1) {
      this.identicon.current.removeChild(children[i])
    }

    this.identicon.current.appendChild(image)
  }

  getStyleFrom = (diameter: number): StyleProps => ({
    width: diameter,
    height: diameter,
  })

  generateBlockieIdenticon = (address: string, diameter: number): HTMLImageElement => {
    const image = new window.Image()
    image.src = makeBlockie(address)
    image.height = diameter
    image.width = diameter
    image.style.borderRadius = `${diameter / 2}px`

    return image
  }

  render() {
    const { className, diameter } = this.props
    const style: StyleProps = this.getStyleFrom(diameter)

    return <div className={className} ref={this.identicon} style={style} />
  }
}
