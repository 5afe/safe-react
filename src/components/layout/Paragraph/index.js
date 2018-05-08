// @flow
import * as React from 'react'
import classNames from 'classnames/bind'
import styles from './index.scss'

const cx = classNames.bind(styles)

type Props = {
  layout?: 'center' | 'left',
  noMargin?: boolean,
  bold?: boolean,
  size?: 'sm' | 'md' | 'lg' | 'xl',
  color?: 'soft' | 'medium' | 'dark' | 'primary',
  children: React$Node
}

class Paragraph extends React.PureComponent<Props> {
  render() {
    const {
      bold, children, color, layout, size, noMargin, ...props
    } = this.props

    return (
      <p className={cx(styles.paragraph, { bold }, { noMargin }, size, layout)} {...props}>
        { children }
      </p>
    )
  }
}

export default Paragraph
