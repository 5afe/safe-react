import classNames from 'classnames/bind'
import React, { MouseEventHandler, CSSProperties, ReactElement, ReactNode } from 'react'

import styles from './index.module.scss'

const cx = classNames.bind(styles)

interface Props {
  align?: string
  children: ReactNode
  className?: string
  color?: string
  dot?: string
  noMargin?: boolean
  size?: string
  transform?: string
  weight?: string
  onClick?: MouseEventHandler<HTMLParagraphElement>
  style?: CSSProperties
  title?: string
}

const Paragraph = (props: Props): ReactElement => {
  const { align, children, className, color, dot, noMargin, size, transform, weight, ...restProps } = props
  return (
    <p
      className={cx(styles.paragraph, className, weight, { noMargin, dot }, size, color, transform, align)}
      {...restProps}
    >
      {children}
    </p>
  )
}

export default Paragraph
