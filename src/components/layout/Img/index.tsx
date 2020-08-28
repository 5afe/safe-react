import classNames from 'classnames/bind'
import React from 'react'

import styles from './index.module.scss'

const cx = classNames.bind(styles)

const Img: any = ({ alt, bordered, className, fullwidth, style, testId = '', ...props }) => {
  const classes = cx(styles.img, { fullwidth, bordered }, className)

  return <img alt={alt} className={classes} data-testid={testId} style={style} {...props} />
}

export default Img
