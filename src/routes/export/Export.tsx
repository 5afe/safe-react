import { ReactElement, useEffect } from 'react'

import Page from 'src/components/layout/Page'
import Block from 'src/components/layout/Block'
import DataExport from 'src/routes/safe/components/Settings/DataExport'
import { Paper } from '@material-ui/core'

function Export(): ReactElement {
  // Hide header elements and the sidebar
  useEffect(() => {
    const header = document?.getElementById('header')
    const sidebar = document?.getElementById('sidebar')
    if (header && sidebar) {
      sidebar.style.display = 'none'
      Array.from(header.children)
        .slice(1)
        .forEach((child: HTMLElement) => {
          child.style.display = 'none'
        })
    }
  }, [])

  return (
    <Page>
      <Block>
        <Paper style={{ padding: '24px' }} elevation={0}>
          <DataExport />
        </Paper>
      </Block>
    </Page>
  )
}

export default Export
