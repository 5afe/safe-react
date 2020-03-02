// @flow
import classNames from 'classnames/bind'
import * as React from 'react'

import styles from './index.scss'

import { capitalize } from '~/utils/css'

const cx = classNames.bind(styles)

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4'

type Props = {
  align?: 'left' | 'center' | 'right',
  margin?: 'sm' | 'md' | 'lg' | 'xl',
  color?: 'soft' | 'medium' | 'dark' | 'white' | 'fancy' | 'primary' | 'secondary' | 'warning' | 'disabled' | 'error',
  tag: HeadingTag,
  truncate?: boolean,
  children: React.Node,
  className?: string,
  testId?: string,
}

const Heading = (props: Props) => {
  const { align, children, className = '', color, margin, tag, testId, truncate, ...rest } = props

  const classes = cx(className, 'heading', align, tag, margin ? capitalize(margin, 'margin') : undefined, color, {
    truncate,
  })

  return React.createElement(tag, { ...rest, className: classes, 'data-testid': testId || '' }, children)
}

export default Heading
