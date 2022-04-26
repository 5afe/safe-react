import { ReactElement } from 'react'
import { Icon, Text, Title, ModalFooterConfirmation } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'
import { ConfirmTxModalProps } from '.'

const Container = styled.div`
  padding: ${({ theme }) => `${theme.margin.sm} ${theme.margin.lg}`};
`

const IconText = styled.div`
  display: flex;
  align-items: center;

  span {
    margin-right: 4px;
  }
`

const FooterWrapper = styled.div`
  margin-top: 15px;
`

export const SafeAppLoadError = ({ onTxReject, onClose, requestId }: ConfirmTxModalProps): ReactElement => {
  const handleTxRejection = () => {
    onTxReject(requestId)
    onClose()
  }

  return (
    <Container>
      <IconText>
        <Icon color="error" size="md" type="info" />
        <Title size="xs">Transaction error</Title>
      </IconText>
      <Text size="lg">
        This Safe App initiated a transaction which cannot be processed. Please get in touch with the developer of this
        Safe App for more information.
      </Text>

      <FooterWrapper>
        <ModalFooterConfirmation
          cancelText="Cancel"
          handleCancel={() => handleTxRejection()}
          handleOk={() => {}}
          okDisabled
          okText="Submit"
        />
      </FooterWrapper>
    </Container>
  )
}
