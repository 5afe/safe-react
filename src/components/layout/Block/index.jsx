// @flow
import classNames from 'classnames/bind'
import React, { PureComponent } from 'react'
import { capitalize } from '~/utils/css'
import { type Size } from '~/theme/size'
import styles from './index.scss'

const cx = classNames.bind(styles)

type Props = {
  margin?: Size,
  padding?: Size,
  align?: 'center' | 'right' | 'left',
  children: React.Node,
  className?: string,
}

class Block extends PureComponent<Props> {
  render() {
    const {
      margin, padding, align, children, className, ...props
    } = this.props

    const paddingStyle = padding ? capitalize(padding, 'padding') : undefined
    return (
      <div className={cx(className, 'block', margin, paddingStyle, align)} {...props}>
        {children}
      </div>
    )
  }
}

export default Block
