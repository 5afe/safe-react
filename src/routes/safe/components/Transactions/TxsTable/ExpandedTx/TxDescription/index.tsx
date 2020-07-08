import { IconText, Text } from '@gnosis.pm/safe-react-components'
import { Collapse as CollapseMUI } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { getTxData } from './utils'

import EtherscanLink from 'src/components/EtherscanLink'
import Block from 'src/components/layout/Block'
import Bold from 'src/components/layout/Bold'
import Paragraph from 'src/components/layout/Paragraph'
import { getNameFromAddressBook } from 'src/logic/addressBook/store/selectors'
import { SAFE_METHODS_NAMES } from 'src/logic/contracts/methodIds'
import OwnerAddressTableCell from 'src/routes/safe/components/Settings/ManageOwners/OwnerAddressTableCell'
import { getTxAmount } from 'src/routes/safe/components/Transactions/TxsTable/columns'

import { lg, md } from 'src/theme/variables'
import {
  extractMultiSendDecodedData,
  isMultiSendDetails,
} from 'src/routes/safe/store/actions/transactions/utils/multiSendDecodedDetails'
import { BigNumber } from 'bignumber.js'
import IconButton from '@material-ui/core/IconButton'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

export const TRANSACTIONS_DESC_ADD_OWNER_TEST_ID = 'tx-description-add-owner'
export const TRANSACTIONS_DESC_REMOVE_OWNER_TEST_ID = 'tx-description-remove-owner'
export const TRANSACTIONS_DESC_CHANGE_THRESHOLD_TEST_ID = 'tx-description-change-threshold'
export const TRANSACTIONS_DESC_SEND_TEST_ID = 'tx-description-send'
export const TRANSACTIONS_DESC_CUSTOM_VALUE_TEST_ID = 'tx-description-custom-value'
export const TRANSACTIONS_DESC_CUSTOM_DATA_TEST_ID = 'tx-description-custom-data'
export const TRANSACTIONS_DESC_NO_DATA = 'tx-description-no-data'

export const styles = () => ({
  txDataContainer: {
    paddingTop: lg,
    paddingLeft: md,
    paddingBottom: md,
  },
  txData: {
    wordBreak: 'break-all',
  },
  txDataParagraph: {
    whiteSpace: 'normal',
  },
  linkTxData: {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  multiSendTxData: {
    marginTop: `-${lg}`,
    marginLeft: `-${md}`,
  },
})

const humanReadableValue = (value: number | string, decimals = 18): string => {
  return new BigNumber(value).times(`1e-${decimals}`).toFixed()
}

const TransferDescription = ({ amount = '', recipient }) => {
  const recipientName = useSelector((state) => getNameFromAddressBook(state, recipient))
  return (
    <Block data-testid={TRANSACTIONS_DESC_SEND_TEST_ID}>
      <Bold>Send {amount} to:</Bold>
      {recipientName ? (
        <OwnerAddressTableCell address={recipient} knownAddress showLinks userName={recipientName} />
      ) : (
        <EtherscanLink knownAddress={false} type="address" value={recipient} />
      )}
    </Block>
  )
}

const RemovedOwner = ({ removedOwner }) => {
  const ownerChangedName = useSelector((state) => getNameFromAddressBook(state, removedOwner))

  return (
    <Block data-testid={TRANSACTIONS_DESC_REMOVE_OWNER_TEST_ID}>
      <Bold>Remove owner:</Bold>
      {ownerChangedName ? (
        <OwnerAddressTableCell address={removedOwner} knownAddress showLinks userName={ownerChangedName} />
      ) : (
        <EtherscanLink knownAddress={false} type="address" value={removedOwner} />
      )}
    </Block>
  )
}

const AddedOwner = ({ addedOwner }) => {
  const ownerChangedName = useSelector((state) => getNameFromAddressBook(state, addedOwner))

  return (
    <Block data-testid={TRANSACTIONS_DESC_ADD_OWNER_TEST_ID}>
      <Bold>Add owner:</Bold>
      {ownerChangedName ? (
        <OwnerAddressTableCell address={addedOwner} knownAddress showLinks userName={ownerChangedName} />
      ) : (
        <EtherscanLink knownAddress={false} type="address" value={addedOwner} />
      )}
    </Block>
  )
}

const NewThreshold = ({ newThreshold }) => (
  <Block data-testid={TRANSACTIONS_DESC_CHANGE_THRESHOLD_TEST_ID}>
    <Bold>Change required confirmations:</Bold>
    <Paragraph noMargin size="md">
      {newThreshold}
    </Paragraph>
  </Block>
)

const SettingsDescription = ({ action, addedOwner, newThreshold, removedOwner }) => {
  if (action === SAFE_METHODS_NAMES.REMOVE_OWNER && removedOwner && newThreshold) {
    return (
      <>
        <RemovedOwner removedOwner={removedOwner} />
        <NewThreshold newThreshold={newThreshold} />
      </>
    )
  }

  if (action === SAFE_METHODS_NAMES.CHANGE_THRESHOLD && newThreshold) {
    return <NewThreshold newThreshold={newThreshold} />
  }

  if (action === SAFE_METHODS_NAMES.ADD_OWNER_WITH_THRESHOLD && addedOwner && newThreshold) {
    return (
      <>
        <AddedOwner addedOwner={addedOwner} />
        <NewThreshold newThreshold={newThreshold} />
      </>
    )
  }

  if (action === SAFE_METHODS_NAMES.SWAP_OWNER && removedOwner && addedOwner) {
    return (
      <>
        <RemovedOwner removedOwner={removedOwner} />
        <AddedOwner addedOwner={addedOwner} />
      </>
    )
  }

  return (
    <Block data-testid={TRANSACTIONS_DESC_NO_DATA}>
      <Bold>No data available for current transaction</Bold>
    </Block>
  )
}

const Wrapper = styled.div``
const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
  align-items: center;
  justify-content: space-between;
  padding: 8px 8px 8px 16px;
  border-bottom: 2px solid rgb(232, 231, 230);

  &:hover {
    cursor: pointer;
  }
`
const Title = styled.div``
const Header = styled.div`
  display: flex;
  flex-direction: column;
`
const TxDetailsMethodName = styled(Text)`
  text-indent: 2%;
`
const TxDetailsMethodParam = styled.div`
  text-indent: 4%;
`
const InlineText = styled(Text)`
  display: inline-flex;
  margin-right: 6px;
`
const Collapse = styled(CollapseMUI)`
  border-bottom: 2px solid rgb(232, 231, 230);
`
const TxDetailsContent = styled.div`
  padding: 8px 8px 8px 16px;
`

const TxInfo = styled.div`
  padding: 8px 8px 8px 16px;
`

interface ICollapsible {
  title: React.ReactNode
  description?: React.ReactNode
}
const Collapsible: React.FC<ICollapsible> = ({ title, description = null, children }) => {
  const [open, setOpen] = React.useState(false)

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <Wrapper>
      <HeaderWrapper onClick={handleClick}>
        <Title>{title}</Title>
        <Header>
          <IconButton disableRipple size="small">
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
          {description}
        </Header>
      </HeaderWrapper>

      <Collapse in={open} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
    </Wrapper>
  )
}

const CustomDescription = ({ classes, recipient, rawTx }: any) => {
  // const recipientName = useSelector((state) => getNameFromAddressBook(state, recipient))

  return (
    <Block className={classes.multiSendTxData} data-testid={TRANSACTIONS_DESC_CUSTOM_DATA_TEST_ID}>
      {extractMultiSendDecodedData(rawTx).txDetails?.map((tx, index) => {
        if (isMultiSendDetails(tx)) {
          return (
            <React.Fragment key={`${tx.to}-row-${index}`}>
              <Collapsible
                title={<IconText iconSize="sm" iconType="code" text={`Transaction ${index + 1}`} textSize="lg" />}
              >
                <TxDetailsContent>
                  <TxInfo>
                    <Bold>Send {humanReadableValue(tx.value)} ETH to:</Bold>
                    <OwnerAddressTableCell address={recipient} showLinks />
                  </TxInfo>
                  {tx.data && (
                    <TxInfo>
                      <TxDetailsMethodName size="lg">{tx.data.method}</TxDetailsMethodName>
                      {tx.data?.parameters.map((param, index) => (
                        <TxDetailsMethodParam key={`${tx.operation}_${tx.to}_${tx.data.method}_param-${index}`}>
                          <InlineText size="lg">
                            {param.name}({param.type}):
                          </InlineText>
                          {param.type === 'address' ? (
                            <EtherscanLink cut={8} value={param.value} />
                          ) : (
                            <InlineText size="lg">{param.value}</InlineText>
                          )}
                        </TxDetailsMethodParam>
                      ))}
                    </TxInfo>
                  )}
                </TxDetailsContent>
              </Collapsible>
            </React.Fragment>
          )
        }
      })}
    </Block>
  )
}

const TxDescription = ({ classes, tx }) => {
  const {
    action,
    addedOwner,
    cancellationTx,
    creationTx,
    customTx,
    data,
    modifySettingsTx,
    newThreshold,
    recipient,
    removedOwner,
    upgradeTx,
  }: any = getTxData(tx)
  const amount = getTxAmount(tx, false)
  return (
    <Block className={classes.txDataContainer}>
      {modifySettingsTx && action && (
        <SettingsDescription
          action={action}
          addedOwner={addedOwner}
          newThreshold={newThreshold}
          removedOwner={removedOwner}
        />
      )}
      {!upgradeTx && customTx && (
        <CustomDescription amount={amount} classes={classes} data={data} recipient={recipient} rawTx={tx} />
      )}
      {upgradeTx && <div>{data}</div>}
      {!cancellationTx && !modifySettingsTx && !customTx && !creationTx && !upgradeTx && (
        <TransferDescription amount={amount} recipient={recipient} />
      )}
    </Block>
  )
}

export default withStyles(styles as any)(TxDescription)
