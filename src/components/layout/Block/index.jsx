// @flow
import classNames from 'classnames/bind'
import * as React from 'react'
import { capitalize } from '~/utils/css'
import { type Size } from '~/theme/size'
import styles from './index.scss'

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
    const {
      margin, padding, justify, children, className, ...props
    } = this.props

    const paddingStyle = padding ? capitalize(padding, 'padding') : undefined
    return (
      <div className={cx(className, 'block', margin, paddingStyle, justify)} {...props}>
        {children}
      </div>
    )
  }
}

export default Block
