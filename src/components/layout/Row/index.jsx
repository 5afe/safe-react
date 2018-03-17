// @flow
import classNames from 'classnames/bind'
import React from 'react'
import styles from './index.scss'

const cx = classNames.bind(styles)

type Props = {
  className?: string,
  children: React.Node,
}

const Row = ({
  children, ...props
}: Props) => {
  const rowClassNames = cx(
    'row',
    props.className,
  )

  return (
    <div className={rowClassNames} {...props}>
      { children }
    </div>
  )
}

export default Row
