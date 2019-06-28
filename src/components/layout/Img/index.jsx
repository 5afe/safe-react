// @flow
import React from 'react'
import classNames from 'classnames/bind'
import styles from './index.scss'

const cx = classNames.bind(styles)

type Props = {
  alt: string,
  fullwidth?: boolean,
  bordered?: boolean,
  className?: string,
  style?: Object,
  testId?: string,
}

const Img = ({
  fullwidth, alt, bordered, className, style, testId = '', ...props
}: Props) => {
  const classes = cx(styles.img, { fullwidth, bordered }, className)

  return <img alt={alt} style={style} className={classes} data-testid={testId} {...props} />
}

export default Img
