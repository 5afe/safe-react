import { ReactElement } from 'react'

import Page from 'src/components/layout/Page'
import Block from 'src/components/layout/Block'
import DataExport from 'src/routes/safe/components/Settings/DataExport'

function Export(): ReactElement {
  return (
    <Page>
      <Block>
        <DataExport />
      </Block>
    </Page>
  )
}

export default Export
