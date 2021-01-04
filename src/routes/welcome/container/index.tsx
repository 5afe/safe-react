import React, { ReactElement } from 'react'
import { WelcomeLayout } from 'src/routes/welcome/components'

import Page from 'src/components/layout/Page'

const Welcome = (): ReactElement => (
  <Page align="center">
    <WelcomeLayout />
  </Page>
)

export default Welcome
