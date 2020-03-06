// @flow
import classNames from 'classnames/bind'
import React from 'react'

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

const Img = ({ alt, bordered, className, fullwidth, style, testId = '', ...props }: Props) => {
  const classes = cx(styles.img, { fullwidth, bordered }, className)

  return <img alt={alt} className={classes} data-testid={testId} style={style} {...props} />
}

export default Img
