// @flow
import * as React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Page from '~/components/layout/Page'

const centerStyle = {
  margin: 'auto 0',
}

const Loader = () => (
  <Page align="center">
    <CircularProgress style={centerStyle} size={60} />
  </Page>
)

export default Loader
