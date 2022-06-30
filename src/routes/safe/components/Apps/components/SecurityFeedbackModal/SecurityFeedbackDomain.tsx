import React from 'react'
import styled from 'styled-components'
import { Icon, Text } from '@gnosis.pm/safe-react-components'

type SecurityFeedbackDomainProps = {
  url: string
  showInOneLine?: boolean
}

const SecurityFeedbackDomain: React.FC<SecurityFeedbackDomainProps> = ({ url, showInOneLine }): React.ReactElement => {
  return (
    <StyledSecurityFeedbackContentText size="xl" showInOneLine={!!showInOneLine}>
      <StyledIcon type="check" color="primary" size="sm" /> {url}
    </StyledSecurityFeedbackContentText>
  )
}

const StyledIcon = styled(Icon)`
  position: relative;
  top: 4px;
  padding-right: 4px;
`

const StyledSecurityFeedbackContentText = styled(Text)<{ showInOneLine: boolean }>`
  display: block;
  font-size: 12px;
  font-weight: bold;
  overflow-wrap: anywhere;
  background-color: #effaf8;
  padding: 10px 15px 10px 10px;
  border-radius: 8px;
  max-width: 75%;
  ${({ showInOneLine }) =>
    showInOneLine &&
    `overflow-y: hidden;
     white-space: nowrap;
     `}
`

export default SecurityFeedbackDomain
