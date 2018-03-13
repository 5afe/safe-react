// @flow
import React from 'react'
import styles from './index.scss'

type Props = {
  children: React.Node,
}

const Page = ({ children }: Props) => (
  <main className={styles.container}>
    {children}
  </main>
)

export default Page
