import { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'
import { CopyToClipboardBtn, Text } from '@gnosis.pm/safe-react-components'

import { InlineEthHashInfo, StyledGridRow } from './styled'
import { getExplorerInfo } from 'src/config'
import { getByteLength } from 'src/utils/getByteLength'

const FlexWrapper = styled.div<{ margin: number }>`
  display: flex;
  align-items: center;

  > :nth-child(2) {
    margin-left: ${({ margin }) => margin}px;
  }
`

type TxDataRowType = { children?: ReactNode; inlineType?: 'hash' | 'rawData'; title: string; value?: string }

export const TxDataRow = ({ children, inlineType, title, value }: TxDataRowType): ReactElement => (
  <StyledGridRow>
    <Text size="xl" as="span">
      {title}
    </Text>
    {value && inlineType === 'hash' && (
      <InlineEthHashInfo textSize="xl" hash={value} shortenHash={8} showCopyBtn explorerUrl={getExplorerInfo(value)} />
    )}
    {value && inlineType === 'rawData' && (
      <FlexWrapper margin={5}>
        <Text size="xl">{value ? getByteLength(value) : 0} bytes</Text>
        <CopyToClipboardBtn textToCopy={value} />
      </FlexWrapper>
    )}
    {!inlineType && value && (
      <Text size="xl" as="span">
        {value}
      </Text>
    )}
    {children}
  </StyledGridRow>
)
