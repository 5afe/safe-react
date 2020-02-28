// @flow
import classNames from 'classnames/bind'
import * as React from 'react'

import styles from './index.scss'

import { type Size } from '~/theme/size'
import { capitalize } from '~/utils/css'

const { PureComponent } = React

const cx = classNames.bind(styles)

type Props = {
  margin?: Size,
  padding?: Size,
  justify?: 'center' | 'right' | 'left' | 'space-around',
  children?: React.Node,
  className?: string,
}

class Block extends PureComponent<Props> {
  render() {
    const { children, className, justify, margin, padding, ...props } = this.props

    const paddingStyle = padding ? capitalize(padding, 'padding') : undefined
    return (
      <div className={cx(className, 'block', margin, paddingStyle, justify)} {...props}>
        {children}
      </div>
    )
  }
}

export default Block
