// @flow
import * as React from 'react'
import classNames from 'classnames/bind'
import styles from './index.scss'

const cx = classNames.bind(styles)

type Props = {
  align?: 'right' | 'center' | 'left',
  noMargin?: boolean,
  weight?: 'light' | 'regular' | 'bold',
  size?: 'sm' | 'md' | 'lg' | 'xl',
  color?: 'soft' | 'medium' | 'dark' | 'primary' | 'fancy',
  transform?: 'capitalize' | 'lowercase' | 'uppercase',
  children: React$Node,
  className?: string,
}

class Paragraph extends React.PureComponent<Props> {
  render() {
    const {
      weight, children, color, align, size, transform, noMargin, className, ...props
    } = this.props

    return (
      <p
        className={cx(styles.paragraph, className, weight, { noMargin }, size, color, transform, align)}
        {...props}
      >
        { children }
      </p>
    )
  }
}

export default Paragraph
