// @flow
import * as React from 'react'
import classNames from 'classnames/bind'
import * as css from './index.scss'

const cx = classNames.bind(css)

type Props = {
  center?: boolean,
  noMargin?: boolean,
  bold?: boolean,
  size?: 'sm',
  color?: 'soft' | 'medium' | 'dark' | 'primary',
  children: React$Node
}

class Paragraph extends React.PureComponent<Props> {
  render() {
    const {
      bold, children, color, center, size, noMargin, ...props
    } = this.props

    return (
      <p className={cx(color, { bold }, { noMargin }, size, { center })} {...props}>
        { children }
      </p>
    )
  }
}

export default Paragraph
