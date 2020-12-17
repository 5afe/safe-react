import * as React from 'react'
import { WelcomeLayout } from 'src/routes/welcome/components/index'

import Page from 'src/components/layout/Page'

const Welcome = (): React.ReactElement => (
  <Page align="center">
    <WelcomeLayout />
  </Page>
)

export default Welcome
