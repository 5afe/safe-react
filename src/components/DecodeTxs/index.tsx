import { ReactElement } from 'react'
import styled from 'styled-components'
import { Transaction } from '@gnosis.pm/safe-apps-sdk-v1'
import { Text, EthHashInfo, CopyToClipboardBtn, IconText, FixedIcon } from '@gnosis.pm/safe-react-components'
import get from 'lodash.get'
import { hexToBytes } from 'web3-utils'

import { DecodedData, DecodedDataBasicParameter, DecodedDataParameterValue } from 'src/types/transactions/decode.d'
import { DecodedTxDetail } from 'src/routes/safe/components/Apps/components/ConfirmTxModal'
import { useSelector } from 'react-redux'
import { currentBlockExplorerInfo, currentNetwork } from 'src/logic/config/store/selectors'
import { AppReduxState } from 'src/store'

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
  const { nativeCurrency } = useSelector(currentNetwork)
  const explorerUrl = useSelector((state: AppReduxState) => currentBlockExplorerInfo(state, txRecipient))

  return (
    <BasicTxInfoWrapper>
      {/* TO */}
      <>
        <Text size="lg" strong>
          {`Send ${txValue} ${nativeCurrency.symbol} to:`}
        </Text>
        <EthHashInfo
          hash={txRecipient}
          showAvatar
          textSize="lg"
          showCopyBtn
          name={recipientName}
          explorerUrl={explorerUrl}
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

export const ParameterElement = ({ parameter }: { parameter: DecodedDataBasicParameter }): ReactElement => {
  const explorerUrl = useSelector((state: AppReduxState) => currentBlockExplorerInfo(state, parameter.value))

  const getValueElement = (parameter: DecodedDataBasicParameter): ReactElement => {
    if (parameter.type === 'address') {
      return <EthHashInfo hash={parameter.value} showAvatar textSize="lg" showCopyBtn explorerUrl={explorerUrl} />
    }

    if (parameter.type.startsWith('bytes')) {
      return (
        <FlexWrapper margin={5}>
          <Text size="lg">{getByteLength(parameter.value)} bytes</Text>
          <CopyToClipboardBtn textToCopy={parameter.value} />
        </FlexWrapper>
      )
    }

    let value = parameter.value
    if (parameter.type.endsWith('[]')) {
      try {
        value = JSON.stringify(parameter.value)
      } catch (e) {}
    }
    return <Text size="lg">{value}</Text>
  }

  return (
    <ElementWrapper>
      <Text size="lg" strong>
        {parameter.name} ({parameter.type})
      </Text>
      {getValueElement(parameter)}
    </ElementWrapper>
  )
}

const SingleTx = ({
  decodedData,
  onTxItemClick,
}: {
  decodedData: DecodedData | null
  onTxItemClick: (decodedTxDetails: DecodedData) => void
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
  decodedData: DecodedData | null
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
  decodedData: DecodedData | null
  onTxItemClick: (decodedTxDetails: DecodedTxDetail) => void
}

export const DecodeTxs = ({ txs, decodedData, onTxItemClick }: Props): ReactElement => {
  return txs.length > 1 ? (
    <MultiSendTx decodedData={decodedData} onTxItemClick={onTxItemClick} />
  ) : (
    <SingleTx decodedData={decodedData} onTxItemClick={onTxItemClick} />
  )
}
