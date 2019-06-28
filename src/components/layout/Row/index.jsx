// @flow
import classNames from 'classnames/bind'
import * as React from 'react'
import { capitalize } from '~/utils/css'
import styles from './index.scss'

const cx = classNames.bind(styles)

type Props = {
  className?: string,
  children: React.Node,
  margin?: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
  align?: 'center' | 'end' | 'start',
  grow?: boolean,
  testId?: string,
}

const Row = ({
  children, className, margin, align, grow, testId = '', ...props
}: Props) => {
  const rowClassNames = cx(
    styles.row,
    margin ? capitalize(margin, 'margin') : undefined,
    align ? capitalize(align, 'align') : undefined,
    { grow },
    className,
  )

  return (
    <div className={rowClassNames} data-testid={testId} {...props}>
      {children}
    </div>
  )
}

export default Row
