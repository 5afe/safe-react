// @flow
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import Block from '~/components/layout/Block'
import Paragraph from '~/components/layout/Paragraph'
import CopyBtn from '~/components/CopyBtn'
import EtherscanBtn from '~/components/EtherscanBtn'
import { shortVersionOf } from '~/logic/wallets/ethAddresses'
import { styles } from './style.js'
import EllipsisTransactionDetails from '~/routes/safe/components/AddressBook/EllipsisTransactionDetails'

type EtherscanLinkProps = {
  type: 'tx' | 'address',
  value: string,
  cut?: number,
  knownAddress?: boolean,
  classes: Object,
}

const EtherscanLink = ({
  type, value, cut, classes, knownAddress,
}: EtherscanLinkProps) => (
  <Block className={classes.etherscanLink}>
    <Paragraph
      size="md"
      noMargin
      className={cn(knownAddress && classes.addressParagraph)}
    >
      {cut ? shortVersionOf(value, cut) : value}
    </Paragraph>
    <CopyBtn content={value} />
    <EtherscanBtn type={type} value={value} />
    {knownAddress !== undefined ? <EllipsisTransactionDetails knownAddress={knownAddress} /> : null}
  </Block>
)

export default withStyles(styles)(EtherscanLink)
