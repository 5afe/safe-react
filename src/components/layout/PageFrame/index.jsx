// @flow
import React from 'react'
import Footer from '~/components/Footer'
import Header from '~/components/Header'
import styles from './index.scss'

type Props = {
  children: React$Node,
}

const PageFrame = ({ children }: Props) => (
  <div className={styles.frame}>
    <Header />
    {children}
    <Footer />
  </div>
)

export default PageFrame
