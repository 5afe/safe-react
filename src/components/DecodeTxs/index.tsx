import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { Transaction } from '@gnosis.pm/safe-apps-sdk-v1'
import { Text, EthHashInfo, CopyToClipboardBtn, IconText, FixedIcon } from '@gnosis.pm/safe-react-components'
import get from 'lodash.get'

import { web3ReadOnly as web3 } from 'src/logic/wallets/getWeb3'
import { getExplorerInfo } from 'src/config'
import { DataDecoded, DataDecodedBasicParameter, DataDecodedParameterValue } from 'src/types/transactions/decode.d'

const FlexWrapper = styled.div<{ margin: number }>`
  display: flex;
  align-items: center;

  > :nth-child(2) {
    margin-left: ${({ margin }) => margin}px;
  }
`

const BasicTxInfoWrapper = styled.div`
  margin-bottom: 15px;

  > :nth-child(2) {
    margin-bottom: 15px;
  }
`

const TxList = styled.div`
  width: 100%;
  border-top: 2px solid ${({ theme }) => theme.colors.separator};
`

const TxListItem = styled.div`
  display: flex;
  justify-content: space-between;

  padding: 0 24px;
  height: 50px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.separator};

  :hover {
    cursor: pointer;
  }
`
const ElementWrapper = styled.div`
  margin-bottom: 15px;
`

export const BasicTxInfo = ({
  txRecipient,
  txData,
  txValue,
}: {
  txRecipient: string
  txData: string
  txValue: string
}): ReactElement => {
  return (
    <BasicTxInfoWrapper>
      {/* TO */}
      <>
        <Text size="lg" strong>
          {`Send ${txValue} ETH to:`}
        </Text>
        <EthHashInfo
          hash={txRecipient}
          showIdenticon
          textSize="lg"
          showCopyBtn
          explorerUrl={getExplorerInfo(txRecipient)}
        />
      </>
      <>
        {/* Data */}
        <Text size="lg" strong>
          Data (hex encoded):
        </Text>
        <FlexWrapper margin={5}>
          <Text size="lg">{web3.utils.hexToBytes(txData).length} bytes</Text>
          <CopyToClipboardBtn textToCopy={txData} />
        </FlexWrapper>
      </>
    </BasicTxInfoWrapper>
  )
}

export const getParameterElement = (parameter: DataDecodedBasicParameter, index: number): ReactElement => {
  let valueElement
  switch (parameter.type) {
    case 'address':
      valueElement = (
        <EthHashInfo
          hash={parameter.value}
          showIdenticon
          textSize="lg"
          showCopyBtn
          explorerUrl={getExplorerInfo(parameter.value)}
        />
      )

      break
    case 'bytes':
      valueElement = (
        <FlexWrapper margin={5}>
          <Text size="lg">{web3.utils.hexToBytes(parameter.value).length} bytes</Text>
          <CopyToClipboardBtn textToCopy={parameter.value} />
        </FlexWrapper>
      )
      break
    default:
      let value = parameter.value
      if (parameter.type.endsWith('[]')) {
        try {
          value = JSON.stringify(parameter.value)
        } catch (e) {}
      }
      valueElement = <Text size="lg">{value}</Text>
  }

  return (
    <ElementWrapper key={index}>
      <Text size="lg" strong>
        {parameter.name} ({parameter.type})
      </Text>
      {valueElement}
    </ElementWrapper>
  )
}

const SingleTx = ({ decodedData }: { decodedData: DataDecoded | null }): ReactElement | null => {
  if (!decodedData) {
    return null
  }

  return (
    <>
      {/* Method */}
      {decodedData.method && (
        <>
          <Text size="lg" strong>
            method:
          </Text>
          <Text size="lg">{decodedData.method}</Text>
        </>
      )}

      {decodedData.parameters.map((p, index) => getParameterElement(p, index))}
    </>
  )
}

const MultiSendTx = ({
  decodedData,
  onTxItemClick,
}: {
  decodedData: DataDecoded | null
  onTxItemClick: (decodedTxDetails: DataDecodedParameterValue) => void
}): ReactElement | null => {
  const txs: DataDecodedParameterValue[] | undefined = get(decodedData, 'parameters[0].valueDecoded')

  if (!txs) {
    return null
  }

  return (
    <TxList>
      {txs.map((tx, index) => {
        return (
          <>
            <TxListItem key={index} onClick={() => onTxItemClick(tx)}>
              <IconText iconSize="sm" iconType="code" text="Contract interaction" textSize="xl" />

              <FlexWrapper margin={20}>
                {tx.dataDecoded && <Text size="xl">{tx.dataDecoded.method}</Text>}
                <FixedIcon type="chevronRight" />
              </FlexWrapper>
            </TxListItem>
          </>
        )
      })}
    </TxList>
  )
}

type Props = {
  txs: Transaction[]
  decodedData: DataDecoded | null
  onTxItemClick: (decodedTxDetails: DataDecodedParameterValue) => void
}

export const DecodeTxs = ({ txs, decodedData, onTxItemClick }: Props): ReactElement => {
  return txs.length > 1 ? (
    <MultiSendTx decodedData={decodedData} onTxItemClick={onTxItemClick} />
  ) : (
    <SingleTx decodedData={decodedData} />
  )
}
