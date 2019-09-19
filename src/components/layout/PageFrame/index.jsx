// @flow
import * as React from 'react'
import Header from '~/components/Header'
import SidebarProvider from '~/components/Sidebar'
import { SharedSnackbarProvider } from '~/components/SharedSnackBar'
import styles from './index.scss'

type Props = {
  children: React.Node,
}

const PageFrame = ({ children }: Props) => (
  <SharedSnackbarProvider>
    <div className={styles.frame}>
      <SidebarProvider>
        <Header />
        {children}
      </SidebarProvider>
    </div>
  </SharedSnackbarProvider>
)

export default PageFrame
