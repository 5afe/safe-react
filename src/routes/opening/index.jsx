// @flow
import * as React from 'react'
import Block from '~/components/layout/Block'
import Paragraph from '~/components/layout/Paragraph'
import LinearProgress from '@material-ui/core/LinearProgress'
import { withStyles } from '@material-ui/core/styles'
import Img from '~/components/layout/Img'
import Page from '~/components/layout/Page'

type Props = {
  name: string,
  classes: Object,
}

const vault = require('./assets/vault.svg')

const styles = {
  page: {
    letterSpacing: '-1px',
  },
}

const Opening = ({ classes, name = 'Safe creation process' }: Props) => (
  <Page align="center">
    <Paragraph className={classes.page} color="secondary" size="xxl" weight="bolder" align="center">
      {name}
    </Paragraph>
    <Block margin="lg" align="center">
      <Img src={vault} height={90} alt="Vault" />
    </Block>
    <Block margin="lg">
      <LinearProgress color="secondary" />
    </Block>
    <Paragraph className={classes.page} noMargin size="xl" align="center">
      Transaction submitted
    </Paragraph>
    <Paragraph className={classes.page} noMargin size="xl" align="center" weight="bolder">
      Deploying your new Safe...
    </Paragraph>
    <Paragraph size="md" align="center" weight="light">
      This process should take a couple of minutes. <br />
    </Paragraph>
  </Page>
)

export default withStyles(styles)(Opening)
