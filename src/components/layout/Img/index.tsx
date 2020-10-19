import classNames from 'classnames/bind'
import React, { ReactElement, ImgHTMLAttributes } from 'react'

import styles from './index.module.scss'

const cx = classNames.bind(styles)

type ImgProps = ImgHTMLAttributes<HTMLImageElement> & {
  bordered?: boolean
  fullwidth?: boolean
  testId?: string
}

const Img = ({ alt, bordered, className, fullwidth, style, testId = '', ...props }: ImgProps): ReactElement => {
  const classes = cx(styles.img, { fullwidth, bordered }, className)

  return <img alt={alt} className={classes} data-testid={testId} style={style} {...props} />
}

export default Img
