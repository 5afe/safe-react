// @flow
import React from 'react'
import Block from '~/components/layout/Block'
import Page from '~/components/layout/Page'
import Footer from '~/components/Footer'
import Header from '~/components/Header'
import styles from './index.scss'

type Props = {
  children: React.Node,
}

const PageFrame = ({ children }: Props) => (
  <Block padding="xl" className={styles.frame}>
    <Header />
    <Page>
      {children}
    </Page>
    <Footer />
  </Block>
)

export default PageFrame
