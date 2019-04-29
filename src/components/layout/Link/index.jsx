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
  color?: 'regular' | 'white',
  className?: string,
}

const GnosisLink = ({
  to, children, color, className, padding, ...props
}: Props) => {
  const internal = /^\/(?!\/)/.test(to)
  const classes = cx(styles.link, color || 'regular', padding ? capitalize(padding, 'padding') : undefined, className)
  const LinkElement = internal ? Link : 'a'

  return (
    <LinkElement className={classes} href={internal ? null : to} to={internal ? to : null} {...props}>
      {children}
    </LinkElement>
  )
}

export default GnosisLink
