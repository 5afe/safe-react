// @flow
import React from 'react'
import { Link } from 'react-router-dom'
import styles from './index.scss'

type Props = {
  to: string,
  children: React.Node,
}

const GnosisLink = ({ to, children, ...props }: Props) => (
  <Link className={styles.link} to={to} {...props}>
    { children }
  </Link>
)

export default GnosisLink
