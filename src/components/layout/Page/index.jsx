// @flow
import classNames from 'classnames/bind'
import React from 'react'
import styles from './index.scss'

const cx = classNames.bind(styles)

type Props = {
  children: React$Node,
  align?: 'center',
  overflow?: boolean
}

const Page = ({ children, align, overflow }: Props) => (
  <main className={cx(styles.page, align, { overflow })}>
    {children}
  </main>
)

export default Page
