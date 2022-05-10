import React, { ReactElement, useEffect } from 'react'
import { useForm } from 'react-final-form'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import TableContainer from '@material-ui/core/TableContainer'

import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { background, border, lg, sm } from 'src/theme/variables'
import {
  FIELD_CREATE_CUSTOM_SAFE_NAME,
  FIELD_CREATE_SUGGESTED_SAFE_NAME,
  FIELD_NEW_SAFE_GAS_LIMIT,
  FIELD_NEW_SAFE_GAS_PRICE,
  FIELD_NEW_SAFE_PROXY_SALT,
  FIELD_NEW_SAFE_THRESHOLD,
  FIELD_SAFE_OWNER_ENS_LIST,
  FIELD_SAFE_OWNERS_LIST,
  FIELD_NEW_SAFE_GAS_MAX_PRIO_FEE,
} from '../fields/createSafeFields'
import { getExplorerInfo, getNativeCurrency } from 'src/config'
import { useEstimateSafeCreationGas } from 'src/logic/hooks/useEstimateSafeCreationGas'
import NetworkLabel from 'src/components/NetworkLabel/NetworkLabel'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { useStepper } from 'src/components/Stepper/stepperContext'
import { providerNameSelector } from 'src/logic/wallets/store/selectors'

export const reviewNewSafeStepLabel = 'Review'

function ReviewNewSafeStep(): ReactElement | null {
  const provider = useSelector(providerNameSelector)

  const { setCurrentStep } = useStepper()

  useEffect(() => {
    if (!provider) {
      setCurrentStep(0)
    }
  }, [provider, setCurrentStep])

  const createSafeForm = useForm()
  const createSafeFormValues = createSafeForm.getState().values

  const defaultSafeValue = createSafeFormValues[FIELD_CREATE_SUGGESTED_SAFE_NAME]
  const safeName = createSafeFormValues[FIELD_CREATE_CUSTOM_SAFE_NAME] || defaultSafeValue
  const threshold = createSafeFormValues[FIELD_NEW_SAFE_THRESHOLD]
  const owners = createSafeFormValues[FIELD_SAFE_OWNERS_LIST]
  const ownersWithENSName = createSafeFormValues[FIELD_SAFE_OWNER_ENS_LIST]
  const numberOfOwners = owners.length
  const safeCreationSalt = createSafeFormValues[FIELD_NEW_SAFE_PROXY_SALT]
  const ownerAddresses = owners.map(({ addressFieldName }) => createSafeFormValues[addressFieldName])

  const { gasCostFormatted, gasLimit, gasPrice, gasMaxPrioFee } = useEstimateSafeCreationGas({
    addresses: ownerAddresses,
    numOwners: numberOfOwners,
    safeCreationSalt,
  })
  const nativeCurrency = getNativeCurrency()

  useEffect(() => {
    createSafeForm.change(FIELD_NEW_SAFE_GAS_LIMIT, gasLimit)
    createSafeForm.change(FIELD_NEW_SAFE_GAS_PRICE, gasPrice)
    createSafeForm.change(FIELD_NEW_SAFE_GAS_MAX_PRIO_FEE, gasMaxPrioFee)
  }, [gasLimit, gasPrice, createSafeForm, gasMaxPrioFee])

  return (
    <Row data-testid={'create-safe-review-step'}>
      <Col xs={4} layout="column">
        <DetailsContainer>
          <Block margin="lg">
            <Paragraph color="primary" noMargin size="lg">
              Details
            </Paragraph>
          </Block>
          <Block margin="lg">
            <Paragraph color="disabled" noMargin size="sm">
              Name of new Safe
            </Paragraph>
            <SafeNameParagraph
              color="primary"
              noMargin
              size="md"
              weight="bolder"
              data-testid="create-safe-review-safe-name"
            >
              {safeName}
            </SafeNameParagraph>
          </Block>
          <Block margin="lg">
            <Paragraph color="disabled" noMargin size="sm">
              Any transaction requires the confirmation of:
            </Paragraph>
            <Paragraph
              color="primary"
              noMargin
              size="md"
              weight="bolder"
              data-testid={'create-safe-review-threshold-label'}
            >
              {`${threshold} out of ${numberOfOwners} owners`}
            </Paragraph>
          </Block>
        </DetailsContainer>
      </Col>
      <Col layout="column" xs={8}>
        <TableContainer>
          <TitleContainer>
            <Paragraph color="primary" noMargin size="lg">
              {`${numberOfOwners} Safe owners`}
            </Paragraph>
          </TitleContainer>
          <Hairline />
          {owners.map(({ nameFieldName, addressFieldName }) => {
            const ownerAddress = createSafeFormValues[addressFieldName]
            const ownerName = createSafeFormValues[nameFieldName] || ownersWithENSName[ownerAddress]
            return (
              <React.Fragment key={`owner-${addressFieldName}`}>
                <OwnersAddressesContainer>
                  <Col align="center" xs={12} data-testid={`create-safe-owner-details-${ownerAddress}`}>
                    <PrefixedEthHashInfo
                      hash={ownerAddress}
                      name={ownerName}
                      showAvatar
                      showCopyBtn
                      explorerUrl={getExplorerInfo(ownerAddress)}
                    />
                  </Col>
                </OwnersAddressesContainer>
                <Hairline />
              </React.Fragment>
            )
          })}
        </TableContainer>
      </Col>
      <DescriptionContainer align="center">
        <Paragraph color="primary" noMargin size="lg">
          You&apos;re about to create a new Safe on <NetworkLabel /> and will have to confirm a transaction with your
          currently connected wallet. The creation will cost approximately {gasCostFormatted} {nativeCurrency.symbol}.
          The exact amount will be determined by your wallet.
        </Paragraph>
      </DescriptionContainer>
    </Row>
  )
}

export default ReviewNewSafeStep

const DetailsContainer = styled(Block)`
  padding: ${lg};
  border-right: solid 1px ${border};
  height: 100%;
`

const SafeNameParagraph = styled(Paragraph)`
  text-overflow: ellipsis;
  overflow: hidden;
`
const TitleContainer = styled(Block)`
  padding: ${lg};
`

const OwnersAddressesContainer = styled(Row)`
  align-items: center;
  min-width: fit-content;
  padding: ${sm};
  padding-left: ${lg};
`
const DescriptionContainer = styled(Row)`
  background-color: ${background};
  padding: ${lg};
  text-align: center;
`
