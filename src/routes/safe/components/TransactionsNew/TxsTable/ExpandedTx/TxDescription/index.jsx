// @flow
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import OpenInNew from '@material-ui/icons/OpenInNew'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import Bold from '~/components/layout/Bold'
import Paragraph from '~/components/layout/Paragraph'
import Block from '~/components/layout/Block'
import { getEtherScanLink } from '~/logic/wallets/getWeb3'
import { shortVersionOf } from '~/logic/wallets/ethAddresses'
import { md, lg, secondary } from '~/theme/variables'
import { getTxData } from './utils'

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
  const {
    recipient, value, modifySettingsTx, replacedOwner, removedOwner, addedOwner, newThreshold,
  } = getTxData(tx)

  return (
    <Block className={classes.txDataContainer}>
      <Paragraph noMargin>
        {modifySettingsTx ? (
          <Bold>Modify Safe Settings</Bold>
        ) : (
          <>
            <Bold>
              Send
              {' '}
              {value}
              {' '}
              {tx.symbol}
              {' '}
to:
            </Bold>
            <br />
            <a href={getEtherScanLink(recipient, 'rinkeby')} target="_blank" rel="noopener noreferrer">
              {shortVersionOf(recipient, 4)}
              <OpenInNew style={openIconStyle} />
            </a>
          </>
        )}
      </Paragraph>
    </Block>
  )
}

export default withStyles(styles)(TxDescription)
