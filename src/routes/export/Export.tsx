import { ReactElement } from 'react'

import Page from 'src/components/layout/Page'
import Block from 'src/components/layout/Block'
import DataExport from 'src/routes/safe/components/Settings/DataExport'
import { Paper } from '@material-ui/core'

function Export(): ReactElement {
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
