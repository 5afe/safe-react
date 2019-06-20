// @flow
import * as React from 'react'
import classNames from 'classnames/bind'
import { capitalize } from '~/utils/css'
import styles from './index.scss'

const cx = classNames.bind(styles)

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4';

type Props = {
  align?: 'left' | 'center' | 'right',
  margin?: 'sm' | 'md' | 'lg' | 'xl',
  color?: 'soft' | 'medium' | 'dark' | 'white' | 'fancy' | 'primary' | 'secondary' | 'warning' | 'disabled' | 'error',
  tag: HeadingTag,
  truncate?: boolean,
  children: React.Node,
}

class Heading extends React.PureComponent<Props> {
  render() {
    const {
      align, tag, truncate, margin, color, children, ...props
    } = this.props

    const className = cx(
      'heading',
      align,
      tag,
      margin ? capitalize(margin, 'margin') : undefined,
      color,
      { truncate },
    )

    return React.createElement(tag, { ...props, className }, children)
  }
}

export default Heading
