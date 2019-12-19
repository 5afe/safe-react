// @flow
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Block from '~/components/layout/Block'
import Span from '~/components/layout/Span'
import CopyBtn from '~/components/CopyBtn'
import EtherscanBtn from '~/components/EtherscanBtn'
import { shortVersionOf } from '~/logic/wallets/ethAddresses'
import { styles } from './style.js'

type EtherscanLinkProps = {
  type: 'tx' | 'address',
  value: string,
  cut?: number,
  classes: Object,
}

const EtherscanLink = ({
  type, value, cut, classes,
}: EtherscanLinkProps) => (
  <Block className={classes.etherscanLink}>
    <Span size="md">
      {cut ? shortVersionOf(value, cut) : value}
    </Span>
    <CopyBtn content={value} />
    <EtherscanBtn type={type} value={value} />
  </Block>
)

export default withStyles(styles)(EtherscanLink)
