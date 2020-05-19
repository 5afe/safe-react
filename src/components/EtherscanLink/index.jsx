//
import { withStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import React from 'react'

import { styles } from './style.js'

import CopyBtn from 'components/CopyBtn'
import EtherscanBtn from 'components/EtherscanBtn'
import Block from 'components/layout/Block'
import Span from 'components/layout/Span'
import { shortVersionOf } from 'logic/wallets/ethAddresses'
import EllipsisTransactionDetails from 'routes/safe/components/AddressBook/EllipsisTransactionDetails'

const EtherscanLink = ({ classes, cut, knownAddress, type, value }) => (
  <Block className={classes.etherscanLink}>
    <Span className={cn(knownAddress && classes.addressParagraph, classes.address)} size="md">
      {cut ? shortVersionOf(value, cut) : value}
    </Span>
    <CopyBtn className={cn(classes.button, classes.firstButton)} content={value} />
    <EtherscanBtn className={classes.button} type={type} value={value} />
    {knownAddress !== undefined ? <EllipsisTransactionDetails address={value} knownAddress={knownAddress} /> : null}
  </Block>
)

export default withStyles(styles)(EtherscanLink)
