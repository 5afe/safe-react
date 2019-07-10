// @flow
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import OpenInNew from '@material-ui/icons/OpenInNew'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import Bold from '~/components/layout/Bold'
import Paragraph from '~/components/layout/Paragraph'
import Block from '~/components/layout/Block'
import { getEtherScanLink, getWeb3 } from '~/logic/wallets/getWeb3'
import { shortVersionOf } from '~/logic/wallets/ethAddresses'
import { md, lg, secondary } from '~/theme/variables'

const web3 = getWeb3()
const { toBN, fromWei } = web3.utils

const openIconStyle = {
  height: '13px',
  color: secondary,
}

export const styles = () => ({
  txDataContainer: {
    padding: `${lg} ${md}`,
  },
})

type Props = {
  classes: Object,
  tx: Transaction,
}

const TxDescription = ({ tx, classes }: Props) => {
  const description = ''

  return (
    <Block className={classes.txDataContainer}>
      <Paragraph noMargin>
        <Bold>
          Send
          {' '}
          {fromWei(toBN(tx.value), 'ether')}
          {' '}
          {tx.symbol}
          {' '}
to:
        </Bold>
        <br />
        <a href={getEtherScanLink(tx.recipient, 'rinkeby')} target="_blank" rel="noopener noreferrer">
          {shortVersionOf(tx.recipient, 4)}
          <OpenInNew style={openIconStyle} />
        </a>
      </Paragraph>
    </Block>
  )
}

export default withStyles(styles)(TxDescription)
