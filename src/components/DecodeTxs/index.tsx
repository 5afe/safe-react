import { ReactElement, useState } from 'react'
import styled from 'styled-components'
import { Transaction } from '@gnosis.pm/safe-apps-sdk-v1'
import { DecodedDataBasicParameter, DecodedDataParameterValue } from '@gnosis.pm/safe-react-gateway-sdk'
import get from 'lodash/get'
import {
  Text,
  CopyToClipboardBtn,
  IconText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@gnosis.pm/safe-react-components'

import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { getExplorerInfo } from 'src/config'
import { DecodedTxDetailType } from 'src/routes/safe/components/Apps/components/ConfirmTxModal'
import PrefixedEthHashInfo from '../PrefixedEthHashInfo'
import { getByteLength } from 'src/utils/getByteLength'
import { getInteractionTitle } from 'src/routes/safe/components/Transactions/helpers/utils'
import {
  DecodedTxDetail,
  isDataDecodedParameterValue,
} from 'src/routes/safe/components/Apps/components/ConfirmTxModal/DecodedTxDetail'

const FlexWrapper = styled.div<{ margin: number }>`
  display: flex;
  align-items: center;

  > :nth-child(2) {
    margin-left: ${({ margin }) => margin}px;
  }
`

const StyledAccordionSummary = styled(AccordionSummary)`
  & .MuiAccordionSummary-content {
    justify-content: space-between;
  }
`

const BasicTxInfoWrapper = styled.div`
  margin-bottom: 15px;

  > :nth-child(2) {
    margin-bottom: 15px;
  }
`

const ElementWrapper = styled.div`
  margin-bottom: 15px;
`

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
  return (
    <BasicTxInfoWrapper>
      {/* TO */}
      <>
        <Row margin="xs">
          <Paragraph color="disabled" noMargin size="lg">
            {getInteractionTitle(txValue)}
          </Paragraph>
        </Row>
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
        <Row margin="xs">
          <Paragraph color="disabled" noMargin size="lg">
            Data (hex encoded):
          </Paragraph>
        </Row>
        <FlexWrapper margin={5}>
          <Paragraph noMargin size="lg">
            {txData ? getByteLength(txData) : 0} bytes
          </Paragraph>
          <CopyToClipboardBtn textToCopy={txData} />
        </FlexWrapper>
      </>
    </BasicTxInfoWrapper>
  )
}

export const getParameterElement = ({ name, type, value }: DecodedDataBasicParameter, index: number): ReactElement => {
  let valueElement

  if (!Array.isArray(value)) {
    switch (type) {
      case 'address':
        valueElement = (
          <PrefixedEthHashInfo hash={value} showAvatar textSize="lg" showCopyBtn explorerUrl={getExplorerInfo(value)} />
        )
        break
      case 'bytes':
        valueElement = (
          <FlexWrapper margin={5}>
            <Text size="lg">{getByteLength(value)} bytes</Text>
            <CopyToClipboardBtn textToCopy={value} />
          </FlexWrapper>
        )
        break
    }
  }

  if (!valueElement) {
    valueElement = <Text size="lg">{JSON.stringify(value)}</Text>
  }

  return (
    <ElementWrapper key={index}>
      <Text size="lg" strong>
        {name} ({type})
      </Text>
      {valueElement}
    </ElementWrapper>
  )
}

const SingleTx = ({ decodedData }: { decodedData: DecodedTxDetailType }): ReactElement | null => {
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false)

  const onChangeExpand = () => {
    setIsAccordionExpanded((prev) => !prev)
  }

  if (!decodedData) {
    return null
  }

  const method = isDataDecodedParameterValue(decodedData) ? decodedData.dataDecoded?.method : decodedData.method

  return (
    <Accordion compact expanded={isAccordionExpanded} onChange={onChangeExpand}>
      <StyledAccordionSummary>
        <IconText iconSize="sm" iconType="code" text="Contract interaction" textSize="xl" />
        <Text size="xl">{method}</Text>
      </StyledAccordionSummary>
      <AccordionDetails>
        <DecodedTxDetail decodedTxData={decodedData} />
      </AccordionDetails>
    </Accordion>
  )
}

const MultiSendTx = ({ decodedData }: { decodedData: DecodedTxDetailType }): ReactElement | null => {
  const txs: DecodedDataParameterValue[] | undefined = get(decodedData, 'parameters[0].valueDecoded')

  if (!txs) {
    return null
  }

  return (
    <>
      {txs.map((tx, index) => (
        <SingleTx key={`${tx.to}_${index}`} decodedData={tx} />
      ))}
    </>
  )
}

type Props = {
  txs: Transaction[]
  decodedData: DecodedTxDetailType
}

export const DecodeTxs = ({ txs, decodedData }: Props): ReactElement => {
  return txs.length > 1 ? <MultiSendTx decodedData={decodedData} /> : <SingleTx decodedData={decodedData} />
}
