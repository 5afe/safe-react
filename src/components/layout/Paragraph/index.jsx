// @flow
import classNames from 'classnames/bind'
import * as React from 'react'

import styles from './index.scss'

const cx = classNames.bind(styles)

type Props = {
  align?: 'right' | 'center' | 'left',
  noMargin?: boolean,
  noPadding?: boolean,
  weight?: 'light' | 'regular' | 'bolder' | 'bold',
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl',
  color?: 'soft' | 'medium' | 'dark' | 'white' | 'fancy' | 'primary' | 'secondary' | 'warning' | 'disabled' | 'error',
  transform?: 'capitalize' | 'lowercase' | 'uppercase',
  children: React.Node,
  dot?: boolean,
  className?: string,
}

class Paragraph extends React.PureComponent<Props> {
  render() {
    const { align, children, className, color, dot, noMargin, size, transform, weight, ...props } = this.props

    return (
      <p
        className={cx(styles.paragraph, className, weight, { noMargin, dot }, size, color, transform, align)}
        {...props}
      >
        {children}
      </p>
    )
  }
}

export default Paragraph
