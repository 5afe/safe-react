// @flow
import classNames from 'classnames/bind'
import React, { PureComponent } from 'react'
import styles from './index.scss'

const cx = classNames.bind(styles)

type Size = 'sm' | 'md' | 'xl' | 'xxl'

type Props = {
  margin?: Size,
  padding?: Size,
  center?: boolean,
  children: React.Node,
  className?: string,
}
const capitalize = (value: Size) => value.charAt(0).toUpperCase() + value.slice(1)

class Block extends PureComponent<Props> {
  render() {
    const {
      margin, padding, center, children, className, ...props
    } = this.props

    const paddingStyle = padding ? `padding${capitalize(padding)}` : undefined
    return (
      <div className={cx(className, margin, paddingStyle, { center })} {...props}>
        { children }
      </div>
    )
  }
}

export default Block
