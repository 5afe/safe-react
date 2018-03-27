// @flow
import classNames from 'classnames/bind'
import React from 'react'
import { capitalize } from '~/utils/css'
import styles from './index.scss'

const cx = classNames.bind(styles)

type Props = {
  className?: string,
  children: React$Node,
  margin?: 'sm' | 'md' | 'lg' | 'xl',
}

const Row = ({
  children, className, margin, ...props
}: Props) => {
  const rowClassNames = cx(
    styles.row,
    margin ? capitalize(margin, 'margin') : undefined,
    className,
  )

  return (
    <div className={rowClassNames} {...props}>
      { children }
    </div>
  )
}

export default Row
