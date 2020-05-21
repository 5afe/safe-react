import classNames from 'classnames/bind'
import * as React from 'react'

import styles from './index.module.scss'

const cx = classNames.bind(styles)

class Paragraph extends React.PureComponent<any> {
  render() {
    const { align, children, className, color, dot, noMargin, size, transform, weight, ...props } = this.props

    return (
      <p
        className={cx(styles.paragraph, className, weight, { noMargin, dot }, size, color, transform, align)}
        {...props}
      >
        {children}
      </p>
    )
  }
}

export default Paragraph
