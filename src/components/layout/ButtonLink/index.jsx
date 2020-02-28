// @flow
/* eslint-disable react/button-has-type  */
import cn from 'classnames/bind'
import * as React from 'react'

import styles from './index.scss'

const cx = cn.bind(styles)

type Props = {
  type?: 'button' | 'submit' | 'reset',
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl',
  weight?: 'light' | 'regular' | 'bolder' | 'bold',
  color?: 'soft' | 'medium' | 'dark' | 'white' | 'fancy' | 'primary' | 'secondary' | 'warning' | 'disabled' | 'error',
  testId?: string,
  className?: string,
}

const GnoButtonLink = ({
  className = '',
  color = 'secondary',
  size = 'md',
  testId = '',
  type = 'button',
  weight = 'regular',
  ...props
}: Props) => (
  <button className={cx(styles.btnLink, size, color, weight, className)} data-testid={testId} type={type} {...props} />
)

export default GnoButtonLink
