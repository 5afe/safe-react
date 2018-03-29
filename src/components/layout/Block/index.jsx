// @flow
import classNames from 'classnames/bind'
import React, { PureComponent } from 'react'
import { capitalize } from '~/utils/css'
import styles from './index.scss'

const cx = classNames.bind(styles)

type Size = 'sm' | 'md' | 'lg' | 'xl'

type Props = {
  margin?: Size,
  padding?: Size,
  center?: boolean,
  children: React$Node,
  className?: string,
}

class Block extends PureComponent<Props> {
  render() {
    const {
      margin, padding, center, children, className, ...props
    } = this.props

    const paddingStyle = padding ? capitalize(padding, 'padding') : undefined
    return (
      <div className={cx(className, 'block', margin, paddingStyle, { center })} {...props}>
        { children }
      </div>
    )
  }
}

export default Block
