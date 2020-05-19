import classNames from 'classnames/bind'
import * as React from 'react'

import { capitalize } from 'src/utils/css'
import styles from './index.module.scss'

const cx = classNames.bind(styles)

class Block extends React.PureComponent<any> {
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
