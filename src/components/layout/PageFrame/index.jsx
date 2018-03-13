// @flow
import React from 'react'
import Page from '~/components/layout/Page'
import Footer from '~/components/Footer'
import Header from '~/components/Header'
import styles from './index.scss'

type Props = {
  children: React.Node,
}

const PageFrame = ({ children }: Props) => (
  <div className={styles.frame}>
    <Header />
    <Page>
      {children}
    </Page>
    <Footer />
  </div>
)

export default PageFrame
