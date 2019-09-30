// @flow
import * as React from 'react'
import classNames from 'classnames/bind'
import { capitalize } from '~/utils/css'
import styles from './index.scss'

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
  const {
    align, tag, truncate, margin, color, children, testId, className = '', ...rest
  } = props

  const classes = cx(className, 'heading', align, tag, margin ? capitalize(margin, 'margin') : undefined, color, {
    truncate,
  })

  return React.createElement(tag, { ...rest, className: classes, 'data-testid': testId || '' }, children)
}

export default Heading
