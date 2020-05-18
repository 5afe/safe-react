// 
import classNames from 'classnames/bind'
import * as React from 'react'

import styles from './index.scss'

const cx = classNames.bind(styles)


const Pre = ({ children, ...props }) => (
  <pre className={cx(styles.pre)} {...props}>
    {children}
  </pre>
)

export default Pre
