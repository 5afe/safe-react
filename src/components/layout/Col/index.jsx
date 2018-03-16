// @flow
import classNames from 'classnames/bind'
import React from 'react'
import { capitalize } from '~/utils/css'
import styles from './index.scss'

const cx = classNames.bind(styles)

type Props = {
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
  xsOffset, smOffset, mdOffset, lgOffset,
  ...props
}: Props) => {
  const colClassNames = cx(
    'col',
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
