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
  margin?: 'sm' | 'md' | 'lg' | 'xxl',
  xs?: number | boolean,
  sm?: number | boolean,
  md?: number | boolean,
  lg?: number | boolean,
  xsOffset?: number,
  smOffset?: number,
  mdOffset?: number,
  lgOffset?: number,
  className?: string,
  children: React.Node,
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
    capitalize(start, 'start'),
    capitalize(center, 'center'),
    capitalize(end, 'end'),
    capitalize(top, 'top'),
    capitalize(middle, 'middle'),
    capitalize(bottom, 'bottom'),
    capitalize(around, 'around'),
    capitalize(between, 'between'),
    capitalize(margin, 'margin'),
    capitalize(xs, 'xs'),
    capitalize(sm, 'sm'),
    capitalize(md, 'md'),
    capitalize(lg, 'lg'),
    capitalize(xsOffset, 'xsOffset'),
    capitalize(smOffset, 'smOffset'),
    capitalize(mdOffset, 'mdOffset'),
    capitalize(lgOffset, 'lgOffset'),
    props.className,
  )

  return (
    <div className={colClassNames} {...props}>
      { children }
    </div>
  )
}

export default Col
