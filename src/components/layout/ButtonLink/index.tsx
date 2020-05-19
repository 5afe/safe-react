/* eslint-disable react/button-has-type  */
import cn from 'classnames/bind'
import * as React from 'react'

import styles from './index.module.scss'

const cx = cn.bind(styles)

const GnoButtonLink = ({
  className = '',
  color = 'secondary',
  size = 'md',
  testId = '',
  type = 'button',
  weight = 'regular',
  ...props
}: any) => (
  <button className={cx(styles.btnLink, size, color, weight, className)} data-testid={testId} type={type} {...props} />
)

export default GnoButtonLink
