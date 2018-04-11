// @flow
import classNames from 'classnames/bind'
import React from 'react'
import { Link } from 'react-router-dom'
import { capitalize } from '~/utils/css'
import styles from './index.scss'

const cx = classNames.bind(styles)

type Props = {
  padding?: 'xs' | 'sm' | 'md',
  to: string,
  children: React$Node,
  className?: string,
}

const GnosisLink = ({
  to, children, className, padding, ...props
}: Props) => {
  const classes = cx(
    styles.link,
    padding ? capitalize(padding, 'padding') : undefined,
    className,
  )

  return (
    <Link className={classes} to={to} {...props}>
      { children }
    </Link>
  )
}

export default GnosisLink
