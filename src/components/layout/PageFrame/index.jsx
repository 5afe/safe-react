// @flow
import React from 'react'
import Page from '~/components/layout/Page'
import Footer from '~/components/Footer'
import Header from '~/components/Header'
import styles from './index.scss'

type Props = {
  children: React$Node,
  align?: "center",
}

const PageFrame = ({ children, align }: Props) => (
  <div className={styles.frame}>
    <Header />
    <Page align={align}>
      {children}
    </Page>
    <Footer />
  </div>
)

export default PageFrame
