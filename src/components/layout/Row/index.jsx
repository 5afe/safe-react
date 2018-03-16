// @flow
import classNames from 'classnames/bind'
import React from 'react'
import { capitalize } from '~/utils/css'
import styles from './index.scss'

const cx = classNames.bind(styles)

type Props = {
  start?: 'xs' | 'sm' | 'md' | 'lg',
  center?: 'xs' | 'sm' | 'md' | 'lg',
  end?: 'xs' | 'sm' | 'md' | 'lg',
  top?: 'xs' | 'sm' | 'md' | 'lg',
  middle?: 'xs' | 'sm' | 'md' | 'lg',
  bottom?: 'xs' | 'sm' | 'md' | 'lg',
  around?: 'xs' | 'sm' | 'md' | 'lg',
  between?: 'xs' | 'sm' | 'md' | 'lg',
  className?: string,
  children: React.Node,
}

const Row = ({
  children, start, center, end, top, middle, bottom, around, between, ...props
}: Props) => {
  const rowClassNames = cx(
    'row',
    capitalize(start, 'start'),
    capitalize(center, 'center'),
    capitalize(end, 'end'),
    capitalize(top, 'top'),
    capitalize(middle, 'middle'),
    capitalize(bottom, 'bottom'),
    capitalize(around, 'around'),
    capitalize(between, 'between'),
    props.className,
  )

  return (
    <div className={rowClassNames} {...props}>
      { children }
    </div>
  )
}

export default Row
