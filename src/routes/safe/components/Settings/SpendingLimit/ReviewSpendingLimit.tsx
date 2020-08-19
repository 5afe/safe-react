import { Button, EthHashInfo, Icon, IconText, Text, Title } from '@gnosis.pm/safe-react-components'
import { Skeleton } from '@material-ui/lab'
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import { getNetwork } from 'src/config'
import { getAddressBook } from 'src/logic/addressBook/store/selectors'
import { getNameFromAdbk } from 'src/logic/addressBook/utils'
import { Token } from 'src/logic/tokens/store/model/token'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'

import { FooterSection, FooterWrapper, StyledButton, TitleSection } from '.'
import { RESET_TIME_OPTIONS } from './ResetTime'
import { useStyles } from './style'
import { SpendingLimitRow } from './utils'

const StyledImage = styled.img`
  width: 32px;
  height: 32px;
  object-fit: contain;
  margin: 0 8px 0 0;
`

const StyledImageName = styled.div`
  display: flex;
  align-items: center;
`

interface ReviewSpendingLimitProps {
  onBack: () => void
  onClose: () => void
  onSubmit: () => void
  txToken: Token | null
  values: Record<string, string>
  existentSpendingLimit?: SpendingLimitRow
}

const ReviewSpendingLimit = ({
  onBack,
  onClose,
  onSubmit,
  txToken,
  values,
  existentSpendingLimit,
}: ReviewSpendingLimitProps): React.ReactElement => {
  const classes = useStyles()
  const addressBook = useSelector(getAddressBook)

  return (
    <>
      <TitleSection>
        <Title size="xs" withoutMargin>
          New Spending Limit{' '}
          <Text size="lg" color="secondaryLight">
            2 of 2
          </Text>
        </Title>

        <StyledButton onClick={onClose}>
          <Icon size="sm" type="cross" />
        </StyledButton>
      </TitleSection>

      <Block className={classes.container}>
        <Col margin="lg">
          <Text size="lg" color="secondaryLight">
            Beneficiary
          </Text>
          <EthHashInfo
            hash={values.beneficiary}
            name={addressBook ? getNameFromAdbk(addressBook, values.beneficiary) : ''}
            showCopyBtn
            showEtherscanBtn
            showIdenticon
            textSize="lg"
            network={getNetwork()}
          />
        </Col>
        <Col margin="lg">
          <Text size="lg" color="secondaryLight">
            Amount
          </Text>
          {txToken !== null ? (
            <>
              <StyledImageName>
                <StyledImage alt={txToken.name} onError={setImageToPlaceholder} src={txToken.logoUri} />
                <Text size="lg">
                  {values.amount} {txToken.symbol}
                </Text>
              </StyledImageName>
              {existentSpendingLimit && (
                <Text size="lg" color="error">
                  Previous Amount: {existentSpendingLimit.amount}
                </Text>
              )}
            </>
          ) : (
            <Skeleton animation="wave" variant="text" />
          )}
        </Col>
        <Col margin="lg">
          <Text size="lg" color="secondaryLight">
            Reset Time
          </Text>
          {values.withResetTime ? (
            <Row align="center" margin="md">
              <IconText
                iconSize="md"
                iconType="fuelIndicator"
                text={RESET_TIME_OPTIONS.find(({ value }) => value === values.resetTime).label}
                textSize="lg"
              />
            </Row>
          ) : (
            <Row align="center" margin="md">
              <Text size="lg">
                {/* TODO: review message */}
                One-time spending limit allowance
              </Text>
            </Row>
          )}
          {existentSpendingLimit && (
            <Row align="center" margin="md">
              <Text size="lg" color="error">
                Previous Reset Time:{' '}
                {RESET_TIME_OPTIONS.find(
                  ({ value }) => value === (+existentSpendingLimit.resetTimeMin / 60 / 24).toString(),
                )?.label ?? 'One-time spending limit allowance'}
              </Text>
            </Row>
          )}
        </Col>

        {existentSpendingLimit && (
          <Text size="xl" color="error" center strong>
            You are about to replace an existent spending limit
          </Text>
        )}
      </Block>

      <FooterSection>
        <FooterWrapper>
          <Button color="primary" size="md" onClick={onBack}>
            Back
          </Button>

          <Button color="primary" size="md" variant="contained" onClick={onSubmit}>
            Submit
          </Button>
        </FooterWrapper>
      </FooterSection>
    </>
  )
}

export default ReviewSpendingLimit
