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
  margin?: 'sm' | 'md' | 'lg' | 'xl',
  xs?: number | boolean,
  sm?: number | boolean,
  md?: number | boolean,
  lg?: number | boolean,
  xsOffset?: number,
  smOffset?: number,
  mdOffset?: number,
  lgOffset?: number,
  className?: string,
  children: React$Node,
}

const Col = ({
  children, margin,
  xs, sm, md, lg,
  start, center, end, top, middle, bottom, around, between,
  xsOffset, smOffset, mdOffset, lgOffset,
  ...props
}: Props) => {
  const colClassNames = cx(
    'col',
    start ? capitalize(start, 'start') : undefined,
    center ? capitalize(center, 'center') : undefined,
    end ? capitalize(end, 'end') : undefined,
    top ? capitalize(top, 'top') : undefined,
    middle ? capitalize(middle, 'middle') : undefined,
    bottom ? capitalize(bottom, 'bottom') : undefined,
    around ? capitalize(around, 'around') : undefined,
    between ? capitalize(between, 'between') : undefined,
    margin ? capitalize(margin, 'margin') : undefined,
    xs ? capitalize(xs, 'xs') : undefined,
    sm ? capitalize(sm, 'sm') : undefined,
    md ? capitalize(md, 'md') : undefined,
    lg ? capitalize(lg, 'lg') : undefined,
    xsOffset ? capitalize(xsOffset, 'xsOffset') : undefined,
    smOffset ? capitalize(smOffset, 'smOffset') : undefined,
    mdOffset ? capitalize(mdOffset, 'mdOffset') : undefined,
    lgOffset ? capitalize(lgOffset, 'lgOffset') : undefined,
    props.className,
  )

  return (
    <div className={colClassNames} {...props}>
      { children }
    </div>
  )
}

export default Col
