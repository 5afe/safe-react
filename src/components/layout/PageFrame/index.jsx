// @flow
import * as React from 'react'
import Footer from '~/components/Footer'
import Header from '~/components/Header'
import Snackbar from '~/components/Snackbar/components/Snackbar'
import styles from './index.scss'

type Props = {
  children: React.Node,
}

const PageFrame = ({ children }: Props) => (
  <Snackbar>
    <div className={styles.frame}>
      <Header />
      {children}
      <Footer />
    </div>
  </Snackbar>
)

export default PageFrame
