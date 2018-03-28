// @flow
import classNames from 'classnames/bind'
import React from 'react'
import styles from './index.scss'

const cx = classNames.bind(styles)

type Props = {
  children: React$Node,
  align?: 'center',
}

const Page = ({ children, align }: Props) => (
  <main className={cx(styles.page, align)}>
    {children}
  </main>
)

export default Page
