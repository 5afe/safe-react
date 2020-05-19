import classNames from 'classnames/bind'
import * as React from 'react'
import { Link } from 'react-router-dom'

import styles from './index.module.scss'

import { capitalize } from 'src/utils/css'

const cx = classNames.bind(styles)

const GnosisLink = ({ children, className, color, innerRef, padding, to, ...props }: any) => {
  const internal = /^\/(?!\/)/.test(to)
  const classes = cx(styles.link, color || 'regular', padding ? capitalize(padding, 'padding') : undefined, className)
  const LinkElement = internal ? Link : 'a'
  const refs: any = {}
  if (internal) {
    // To avoid warning about React not recognizing the prop innerRef on native element (a) if the link is external
    refs.innerRef = innerRef
  }

  return (
    <LinkElement className={classes} href={internal ? null : to} to={internal ? to : null} {...refs} {...props}>
      {children}
    </LinkElement>
  )
}

// https://material-ui.com/guides/composition/#caveat-with-refs
const LinkWithRef: any = React.forwardRef((props, ref) => <GnosisLink {...props} innerRef={ref} />)

export default LinkWithRef
