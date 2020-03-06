// @flow
import classNames from 'classnames/bind'
import * as React from 'react'

import styles from './index.scss'

import { capitalize } from '~/utils/css'

const cx = classNames.bind(styles)

type Props = {
  className?: string,
  children: React.Node,
  margin?: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
  align?: 'center' | 'end' | 'start',
  grow?: boolean,
  testId?: string,
}

const Row = ({ align, children, className, grow, margin, testId = '', ...props }: Props) => {
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
