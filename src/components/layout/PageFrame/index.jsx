// @flow
import React from 'react'
import Footer from '~/components/Footer'
import Header from '~/components/Header'
import { SharedSnackbarProvider } from '~/components/SharedSnackBar'
import styles from './index.scss'

type Props = {
  children: React.Node,
}

const PageFrame = ({ children }: Props) => (
  <SharedSnackbarProvider>
    <div className={styles.frame}>
      <Header />
      {children}
      <Footer />
    </div>
  </SharedSnackbarProvider>
)

export default PageFrame
