// @flow
import * as React from 'react'
import { SnackbarProvider } from 'notistack'
import SidebarProvider from '~/components/Sidebar'
import Footer from '~/components/Footer'
import Header from '~/components/Header'
import styles from './index.scss'

type Props = {
  children: React.Node,
}

const PageFrame = ({ children }: Props) => (
  <SnackbarProvider
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    classes={{
      variantSuccess: styles.success,
      variantError: styles.error,
      variantWarning: styles.warning,
      variantInfo: styles.info,
    }}
  >
    <div className={styles.frame}>
      <SidebarProvider>
        <Header />
        {children}
      </SidebarProvider>
    </div>
  </SnackbarProvider>
)

export default PageFrame
