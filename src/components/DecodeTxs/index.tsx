import { ReactElement } from 'react'
import styled from 'styled-components'
import { Transaction } from '@gnosis.pm/safe-apps-sdk-v1'
import {
  DecodedDataResponse,
  DecodedDataBasicParameter,
  DecodedDataParameterValue,
} from '@gnosis.pm/safe-react-gateway-sdk'
import get from 'lodash/get'
import { Text, CopyToClipboardBtn, IconText, FixedIcon } from '@gnosis.pm/safe-react-components'
import { hexToBytes } from 'web3-utils'

import { getExplorerInfo, getNativeCurrency } from 'src/config'
import { DecodedTxDetail } from 'src/routes/safe/components/Apps/components/ConfirmTxModal'
import PrefixedEthHashInfo from '../PrefixedEthHashInfo'

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
  max-height: 260px;
  overflow-y: auto;
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

export const getByteLength = (data: string | string[]): number => {
  try {
    if (!Array.isArray(data)) {
      data = data.split(',')
    }
    // Return the sum of the byte sizes of each hex string
    return data.reduce((result, hex) => {
      const bytes = hexToBytes(hex)
      return result + bytes.length
    }, 0)
  } catch (err) {
    return 0
  }
}

export const BasicTxInfo = ({
  txRecipient,
  txData,
  txValue,
  recipientName,
}: {
  txRecipient: string
  txData: string
  txValue: string
  recipientName?: string
}): ReactElement => {
  const nativeCurrency = getNativeCurrency()

  return (
    <BasicTxInfoWrapper>
      {/* TO */}
      <>
        <Text size="lg" strong>
          {`Send ${txValue} ${nativeCurrency.symbol} to:`}
        </Text>
        <PrefixedEthHashInfo
          hash={txRecipient}
          showAvatar
          textSize="lg"
          showCopyBtn
          name={recipientName}
          explorerUrl={getExplorerInfo(txRecipient)}
        />
      </>
      <>
        {/* Data */}
        <Text size="lg" strong>
          Data (hex encoded):
        </Text>
        <FlexWrapper margin={5}>
          <Text size="lg">{txData ? getByteLength(txData) : 0} bytes</Text>
          <CopyToClipboardBtn textToCopy={txData} />
        </FlexWrapper>
      </>
    </BasicTxInfoWrapper>
  )
}

export const getParameterElement = (parameter: DecodedDataBasicParameter, index: number): ReactElement => {
  let valueElement

  if (parameter.type === 'address') {
    valueElement = (
      <PrefixedEthHashInfo
        hash={parameter.value}
        showAvatar
        textSize="lg"
        showCopyBtn
        explorerUrl={getExplorerInfo(parameter.value)}
      />
    )
  }

  if (parameter.type.startsWith('bytes')) {
    valueElement = (
      <FlexWrapper margin={5}>
        <Text size="lg">{getByteLength(parameter.value)} bytes</Text>
        <CopyToClipboardBtn textToCopy={parameter.value} />
      </FlexWrapper>
    )
  }

  if (!valueElement) {
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

const SingleTx = ({
  decodedData,
  onTxItemClick,
}: {
  decodedData: DecodedDataResponse | null
  onTxItemClick: (decodedTxDetails: DecodedDataResponse) => void
}): ReactElement | null => {
  if (!decodedData) {
    return null
  }

  return (
    <TxList>
      <TxListItem onClick={() => onTxItemClick(decodedData)}>
        <IconText iconSize="sm" iconType="code" text="Contract interaction" textSize="xl" />

        <FlexWrapper margin={20}>
          <Text size="xl">{decodedData.method}</Text>
          <FixedIcon type="chevronRight" />
        </FlexWrapper>
      </TxListItem>
    </TxList>
  )
}

const MultiSendTx = ({
  decodedData,
  onTxItemClick,
}: {
  decodedData: DecodedDataResponse | null
  onTxItemClick: (decodedTxDetails: DecodedDataParameterValue) => void
}): ReactElement | null => {
  const txs: DecodedDataParameterValue[] | undefined = get(decodedData, 'parameters[0].valueDecoded')

  if (!txs) {
    return null
  }

  return (
    <TxList>
      {txs.map((tx, index) => (
        <TxListItem key={index} onClick={() => onTxItemClick(tx)}>
          <IconText iconSize="sm" iconType="code" text="Contract interaction" textSize="xl" />

          <FlexWrapper margin={20}>
            {tx.dataDecoded && <Text size="xl">{tx.dataDecoded.method}</Text>}
            <FixedIcon type="chevronRight" />
          </FlexWrapper>
        </TxListItem>
      ))}
    </TxList>
  )
}

type Props = {
  txs: Transaction[]
  decodedData: DecodedDataResponse | null
  onTxItemClick: (decodedTxDetails: DecodedTxDetail) => void
}

export const DecodeTxs = ({ txs, decodedData, onTxItemClick }: Props): ReactElement => {
  return txs.length > 1 ? (
    <MultiSendTx decodedData={decodedData} onTxItemClick={onTxItemClick} />
  ) : (
    <SingleTx decodedData={decodedData} onTxItemClick={onTxItemClick} />
  )
}
