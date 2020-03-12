// @flow
import LinearProgress from '@material-ui/core/LinearProgress'
import { withStyles } from '@material-ui/core/styles'
import OpenInNew from '@material-ui/icons/OpenInNew'
import * as React from 'react'

import { type SelectorProps } from '../container/selector'

import Block from '~/components/layout/Block'
import Img from '~/components/layout/Img'
import Page from '~/components/layout/Page'
import Paragraph from '~/components/layout/Paragraph'
import { getEtherScanLink } from '~/logic/wallets/getWeb3'
import { mediumFontSize, secondary, xs } from '~/theme/variables'

type Props = SelectorProps & {
  name: string,
  tx: string,
  classes: Object,
}

const vault = require('../assets/vault.svg')

const styles = {
  icon: {
    height: mediumFontSize,
    color: secondary,
  },
  follow: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: xs,
  },
  etherscan: {
    color: secondary,
    textDecoration: 'underline',
    display: 'flex',
    alignItems: 'center',
    marginLeft: xs,
  },
}

const Opening = ({ classes, name = 'Safe creation process', tx }: Props) => (
  <Page align="center">
    <Paragraph align="center" color="primary" size="xxl" weight="bold">
      {name}
    </Paragraph>
    <Block align="center" margin="lg">
      <Img alt="Vault" height={90} src={vault} />
    </Block>
    <Block margin="lg">
      <LinearProgress color="secondary" />
    </Block>
    <Block margin="md">
      <Paragraph align="center" className={classes.page} noMargin size="xl">
        Transaction submitted
      </Paragraph>
      <Paragraph align="center" className={classes.page} noMargin size="xl" weight="bolder">
        Deploying your new Safe...
      </Paragraph>
    </Block>
    <Block margin="md">
      <Paragraph align="center" noMargin size="md" weight="light">
        This process should take a couple of minutes. <br />
      </Paragraph>
      {tx && (
        <Paragraph align="center" className={classes.follow} noMargin size="md" weight="light">
          Follow progress on{' '}
          <a className={classes.etherscan} href={getEtherScanLink('tx', tx)} rel="noopener noreferrer" target="_blank">
            Etherscan.io
            <OpenInNew className={classes.icon} />
          </a>
        </Paragraph>
      )}
    </Block>
  </Page>
)

export default withStyles(styles)(Opening)
