import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { Transaction } from '@gnosis.pm/safe-apps-sdk-v1'
import { Text, EthHashInfo, CopyToClipboardBtn, IconText, FixedIcon } from '@gnosis.pm/safe-react-components'
import get from 'lodash.get'

import { web3ReadOnly as web3 } from 'src/logic/wallets/getWeb3'
import { getExplorerInfo } from 'src/config'
import { getNetworkInfo } from 'src/config'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { DataDecoded, DataDecodedBasicParameter, DataDecodedValue } from 'src/types/transactions/decode.d'

const FlexWrapper = styled.div<{ margin: number }>`
  display: flex;
  align-items: center;

  *:nth-child(2) {
    margin-left: ${({ margin }) => margin}px;
  }
`

const TxList = styled.div``

const TxListItem = styled.div`
  display: flex;
  justify-content: space-between;
  height: 40px;

  border: 1px solid red;
`

const { nativeCoin } = getNetworkInfo()

const BasicTxInfo = ({
  txRecipient,
  txData,
  txValue,
}: {
  txRecipient: string
  txData: string
  txValue: string
}): ReactElement => {
  return (
    <>
      {/* TO */}
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

      {/* Data */}
      <Text size="lg" strong>
        Data (hex encoded):
      </Text>
      <FlexWrapper margin={5}>
        <Text size="lg">{web3.utils.hexToBytes(txData).length} bytes</Text>
        <CopyToClipboardBtn textToCopy={txData} />
      </FlexWrapper>
    </>
  )
}

const getParameterElement = (parameter: DataDecodedBasicParameter, index: number): ReactElement => {
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
    <div key={index}>
      <Text size="lg" strong>
        {parameter.name} ({parameter.type})
      </Text>
      {valueElement}
    </div>
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

const MultiSendTx = ({ decodedData }: { decodedData: DataDecoded | null }): ReactElement | null => {
  const txs: DataDecodedValue[] | undefined = get(decodedData, 'parameters[0].valueDecoded')

  if (!txs) {
    return null
  }

  return (
    <TxList>
      {txs.map((tx, index) => {
        const txValue = fromTokenUnit(tx.value, nativeCoin.decimals)
        return (
          <>
            <TxListItem key={index}>
              <IconText iconSize="sm" iconType="code" text="Contract interaction" textSize="xl" />

              <FlexWrapper margin={20}>
                {tx.dataDecoded && <Text size="xl">{tx.dataDecoded.method}</Text>}
                <FixedIcon type="chevronRight" />
              </FlexWrapper>
            </TxListItem>
            <BasicTxInfo txRecipient={tx.to} txData={tx.data} txValue={txValue} />
            {tx.dataDecoded?.parameters.map((p, index) => getParameterElement(p, index))}
          </>
        )
      })}
    </TxList>
  )
}

type Props = {
  txs: Transaction[]
  txRecipient: string
  txData: string
  txValue: string
  decodedData: DataDecoded | null
}

export const DecodeTxs = ({ txs, txRecipient, txData, txValue, decodedData }: Props): ReactElement => {
  const isMultiSend = txs.length > 1

  return (
    <>
      <BasicTxInfo txRecipient={txRecipient} txData={txData} txValue={txValue} />

      {/* TXs Decoding */}
      {isMultiSend && <MultiSendTx decodedData={decodedData} />}
      {!isMultiSend && <SingleTx decodedData={decodedData} />}
    </>
  )
}
