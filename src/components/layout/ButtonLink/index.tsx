import cn from 'classnames/bind'
import { ReactElement } from 'react'

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
}: any): ReactElement => (
  <button className={cx(styles.btnLink, size, color, weight, className)} data-testid={testId} type={type} {...props} />
)

export default GnoButtonLink
