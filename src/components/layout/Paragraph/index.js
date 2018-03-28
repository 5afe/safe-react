// @flow
import * as React from 'react'
import classNames from 'classnames/bind'
import styles from './index.scss'

const cx = classNames.bind(styles)

type Props = {
  center?: boolean,
  noMargin?: boolean,
  bold?: boolean,
  size?: 'sm' | 'md' | 'lg',
  color?: 'soft' | 'medium' | 'dark' | 'primary',
  children: React$Node
}

class Paragraph extends React.PureComponent<Props> {
  render() {
    const {
      bold, children, color, center, size, noMargin, ...props
    } = this.props

    return (
      <p className={cx(styles.paragraph, { bold }, { noMargin }, size, { center })} {...props}>
        { children }
      </p>
    )
  }
}

export default Paragraph
