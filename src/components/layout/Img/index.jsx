// @flow
import classNames from 'classnames/bind'
import React, { PureComponent } from 'react'
import styles from './index.scss'

const cx = classNames.bind(styles)

type Props = {
  alt: string,
  fullwidth?: boolean,
  bordered?: boolean,
  className?: string,
}

class Img extends PureComponent<Props> {
  render() {
    const {
      fullwidth, alt, bordered, className, ...props
    } = this.props

    return <img alt={alt} {...props} className={cx(styles.img, { fullwidth, bordered }, className)} />
  }
}

export default Img
