import classNames from 'classnames/bind'
import * as React from 'react'

import styles from './index.module.scss'

import { capitalize } from 'src/utils/css'

const cx = classNames.bind(styles)

const Row = ({ align, children, className, grow, margin, testId = '', ...props }: any) => {
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
