// @flow
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import Block from '~/components/layout/Block'
import CopyBtn from '~/components/CopyBtn'
import EtherscanBtn from '~/components/EtherscanBtn'
import { shortVersionOf } from '~/logic/wallets/ethAddresses'
import { styles } from './style.js'
import EllipsisTransactionDetails from '~/routes/safe/components/AddressBook/EllipsisTransactionDetails'
import Span from '~/components/layout/Span'

type EtherscanLinkProps = {
  classes: Object,
  cut?: number,
  knownAddress?: boolean,
  type: 'tx' | 'address',
  value: string,
}

const EtherscanLink = ({
  type, value, cut, classes, knownAddress,
}: EtherscanLinkProps) => (
  <Block className={classes.etherscanLink}>
    <Span
      className={cn(knownAddress && classes.addressParagraph)}
      size="md"
    >
      {cut ? shortVersionOf(value, cut) : value}
    </Span>
    <CopyBtn className={cn(classes.button, classes.firstButton)} content={value} />
    <EtherscanBtn className={classes.button} type={type} value={value} />
    {knownAddress !== undefined ? <EllipsisTransactionDetails knownAddress={knownAddress} address={value} /> : null}
  </Block>
)

export default withStyles(styles)(EtherscanLink)
