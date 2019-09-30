// @flow
/* eslint-disable react/button-has-type  */
import * as React from 'react'
import cn from 'classnames/bind'
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
  type = 'button',
  size = 'md',
  weight = 'regular',
  color = 'secondary',
  testId = '',
  className = '',
  ...props
}: Props) => <button type={type} className={cx(styles.btnLink, size, color, weight, className)} data-testid={testId} {...props} />

export default GnoButtonLink
