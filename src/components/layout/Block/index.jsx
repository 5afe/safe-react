// 
import classNames from 'classnames/bind'
import * as React from 'react'

import styles from './index.scss'

import { } from 'src/theme/size'
import { capitalize } from 'src/utils/css'

const { PureComponent } = React

const cx = classNames.bind(styles)


class Block extends PureComponent {
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
