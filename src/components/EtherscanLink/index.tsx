import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import React from 'react'

import { styles } from './style'

import CopyBtn from 'src/components/CopyBtn'
import Block from 'src/components/layout/Block'
import Span from 'src/components/layout/Span'
import { shortVersionOf } from 'src/logic/wallets/ethAddresses'
import { EllipsisTransactionDetails } from 'src/routes/safe/components/AddressBook/EllipsisTransactionDetails'
import { ExplorerButton } from '@gnosis.pm/safe-react-components'
import { getExplorerInfo } from 'src/config'

const useStyles = makeStyles(styles)

interface EtherscanLinkProps {
  className?: string
  cut?: number
  knownAddress?: boolean
  value: string
  sendModalOpenHandler?: () => void
}

export const EtherscanLink = ({
  className,
  cut,
  knownAddress,
  value,
  sendModalOpenHandler,
}: EtherscanLinkProps): React.ReactElement => {
  const classes = useStyles()

  return (
    <Block className={cn(classes.etherscanLink, className)}>
      <Span className={cn(knownAddress && classes.addressParagraph, classes.address)} size="md">
        {cut ? shortVersionOf(value, cut) : value}
      </Span>
      <CopyBtn className={cn(classes.button, classes.firstButton)} content={value} />
      <ExplorerButton explorerUrl={getExplorerInfo(value)} />
      {knownAddress !== undefined ? (
        <EllipsisTransactionDetails
          address={value}
          knownAddress={knownAddress}
          sendModalOpenHandler={sendModalOpenHandler}
        />
      ) : null}
    </Block>
  )
}
