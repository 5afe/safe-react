import classNames from 'classnames/bind'
import React from 'react'

import styles from './index.module.scss'

const cx = classNames.bind(styles)

const Page = ({ align, children, overflow }: any) => (
  <main className={cx(styles.page, align, { overflow })}>{children}</main>
)

export default Page
