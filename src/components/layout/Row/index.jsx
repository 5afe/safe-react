// @flow
import classNames from 'classnames/bind'
import React from 'react'
import styles from './index.scss'

const cx = classNames.bind(styles)

type Props = {
  className?: string,
  children: React$Node,
}

const Row = ({ children, className, ...props }: Props) => (
  <div className={cx(styles.row, className)} {...props}>
    { children }
  </div>
)

export default Row
