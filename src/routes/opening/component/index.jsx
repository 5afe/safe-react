// @flow
import * as React from 'react'
import OpenInNew from '@material-ui/icons/OpenInNew'
import LinearProgress from '@material-ui/core/LinearProgress'
import { withStyles } from '@material-ui/core/styles'
import Block from '~/components/layout/Block'
import Paragraph from '~/components/layout/Paragraph'
import Img from '~/components/layout/Img'
import Page from '~/components/layout/Page'
import { getEtherScanLink } from '~/logic/wallets/etherscan'
import { mediumFontSize, secondary, xs } from '~/theme/variables'
import { type SelectorProps } from '../container/selector'

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

const Opening = ({
  classes, name = 'Safe creation process', tx,
}: Props) => (
  <Page align="center">
    <Paragraph color="primary" size="xxl" weight="bold" align="center">
      {name}
    </Paragraph>
    <Block margin="lg" align="center">
      <Img src={vault} height={90} alt="Vault" />
    </Block>
    <Block margin="lg">
      <LinearProgress color="secondary" />
    </Block>
    <Block margin="md">
      <Paragraph className={classes.page} noMargin size="xl" align="center">
        Transaction submitted
      </Paragraph>
      <Paragraph className={classes.page} noMargin size="xl" align="center" weight="bolder">
        Deploying your new Safe...
      </Paragraph>
    </Block>
    <Block margin="md">
      <Paragraph size="md" align="center" weight="light" noMargin>
        This process should take a couple of minutes.
        {' '}
        <br />
      </Paragraph>
      {tx && (
        <Paragraph className={classes.follow} size="md" align="center" weight="light" noMargin>
          Follow progress on
          {' '}
          <a
            href={getEtherScanLink('tx', tx)}
            target="_blank"
            rel="noopener noreferrer"
            className={classes.etherscan}
          >
            Etherscan.io
            <OpenInNew className={classes.icon} />
          </a>
        </Paragraph>
      )}
    </Block>
  </Page>
)

export default withStyles(styles)(Opening)
