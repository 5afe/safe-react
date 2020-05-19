//
import * as React from 'react'

import { toDataUrl } from './blockies'

export default class Identicon extends React.PureComponent {
  static defaultProps = {
    className: '',
  }

  identicon

  constructor(props) {
    super(props)

    this.identicon = React.createRef()
  }

  componentDidMount = () => {
    const { address, diameter } = this.props
    const image = this.generateBlockieIdenticon(address, diameter)
    if (this.identicon.current) {
      this.identicon.current.appendChild(image)
    }
  }

  componentDidUpdate = () => {
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

  getStyleFrom = (diameter) => ({
    width: diameter,
    height: diameter,
  })

  generateBlockieIdenticon = (address, diameter) => {
    const image = new window.Image()
    image.src = toDataUrl(address)
    image.height = diameter
    image.width = diameter
    image.style.borderRadius = `${diameter / 2}px`

    return image
  }

  render() {
    const { className, diameter } = this.props
    const style = this.getStyleFrom(diameter)

    return <div className={className} ref={this.identicon} style={style} />
  }
}
