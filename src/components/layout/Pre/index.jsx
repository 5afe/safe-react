// @flow
import classNames from 'classnames/bind'
import * as React from 'react'

import styles from './index.scss'

const cx = classNames.bind(styles)

type Props = {
  children: React.Node,
}

const Pre = ({ children, ...props }: Props) => (
  <pre className={cx(styles.pre)} {...props}>
    {children}
  </pre>
)

export default Pre
