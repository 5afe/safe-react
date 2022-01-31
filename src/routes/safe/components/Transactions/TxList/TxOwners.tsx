import { ReactElement, useState } from 'react'
import styled from 'styled-components'
import { Step, StepConnector, StepContent, StepLabel, Stepper } from '@material-ui/core'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import ControlPointIcon from '@material-ui/icons/ControlPoint'
import RadioButtonUncheckedOutlinedIcon from '@material-ui/icons/RadioButtonUncheckedOutlined'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined'

import { ExpandedTxDetails, isMultiSigExecutionDetails } from 'src/logic/safe/store/models/types/gateway.d'
import { AddressInfo } from 'src/routes/safe/components/Transactions/TxList/AddressInfo'
import { isCancelTxDetails } from 'src/routes/safe/components/Transactions/TxList/utils'
import { black300, primary400 } from 'src/theme/variables'

// Icons
const getStyledIcon = (icon: typeof ControlPointIcon): typeof ControlPointIcon => {
  return styled(icon)`
    height: 20px;
    width: 20px;
    margin-left: 2px;
  `
}

const TxCreationIcon = getStyledIcon(ControlPointIcon)

const TxRejectionIcon = getStyledIcon(CancelOutlinedIcon)

const CheckIcon = getStyledIcon(CheckCircleIcon)

const CircleIcon = styled(getStyledIcon(RadioButtonUncheckedOutlinedIcon))`
  stroke: currentColor;
  stroke-width: 1px;
`

const DotIcon = styled(FiberManualRecordIcon)`
  height: 14px;
  width: 14px;
  margin-left: 5px;
`

// Stepper
const StyledStepper = styled(Stepper)`
  padding: 0;
`

const StyledStepConnector = styled(StepConnector)`
  padding: 0;

  .MuiStepConnector-line {
    margin-left: -1px;
    border-color: gray500;
    border-left-width: 2px;
    min-height: 14px;
  }
`

type StepColor = 'green' | 'gray' | 'orange'
const getStepColor = (color: StepColor): string => {
  switch (color) {
    case 'green':
      return primary400
    case 'gray':
      return black300
    case 'orange':
      return '#e8663d'
  }
}

type StyledStepProps = {
  bold?: boolean
  color: StepColor
}
const StyledStep = styled(Step)<StyledStepProps>`
  height: max-content;

  .MuiStepLabel-label {
    font-weight: ${({ bold = false }) => (bold ? 'bold' : 'normal')};
    color: ${({ color }) => getStepColor(color)};
  }

  .MuiStepLabel-completed {
    color: ${getStepColor('green')};
  }

  .MuiStepLabel-iconContainer {
    color: ${({ color }) => getStepColor(color)};
    align-items: center;
    padding-top: 5px;
    padding-bottom: 5px;
    background-color: white;
  }

  .MuiStepLabel-active {
    color: ${getStepColor('orange')};
  }

  .MuiStepContent-root {
    color: ${getStepColor('gray')};
  }
`

export const TxOwners = ({
  txDetails,
  isPending,
}: {
  txDetails: ExpandedTxDetails
  isPending: boolean
}): ReactElement | null => {
  const { txInfo, detailedExecutionInfo } = txDetails

  const [hideConfirmations, showConfirmations] = useState<boolean>(false)
  const toggleHide = () => {
    showConfirmations((prev) => !prev)
  }

  if (!detailedExecutionInfo || !isMultiSigExecutionDetails(detailedExecutionInfo)) {
    return null
  }

  const confirmationsNeeded = detailedExecutionInfo.confirmationsRequired - detailedExecutionInfo.confirmations.length
  const isConfirmed = confirmationsNeeded <= 0
  const isExecuted = !!detailedExecutionInfo.executor

  return (
    <StyledStepper orientation="vertical" nonLinear activeStep={-1} connector={<StyledStepConnector />}>
      {isCancelTxDetails(txInfo) ? (
        <StyledStep bold color="green">
          <StepLabel icon={<TxRejectionIcon />}>On-chain rejection created</StepLabel>
        </StyledStep>
      ) : (
        <StyledStep bold color="green">
          <StepLabel icon={<TxCreationIcon />}>Created</StepLabel>
        </StyledStep>
      )}
      <StyledStep bold color={isConfirmed ? 'green' : 'orange'}>
        <StepLabel icon={isConfirmed ? <CheckIcon /> : <CircleIcon />}>
          Confirmations{' '}
          <span style={{ color: '#B2BBC0', fontWeight: 'normal' }}>
            ({`${detailedExecutionInfo.confirmations.length} of ${detailedExecutionInfo.confirmationsRequired}`})
          </span>
        </StepLabel>
      </StyledStep>
      {!hideConfirmations &&
        detailedExecutionInfo.confirmations.map(({ signer }) => (
          <StyledStep key={signer.value} bold color="green">
            <StepLabel icon={<DotIcon />}>
              <AddressInfo
                address={signer.value}
                name={signer?.name || undefined}
                avatarUrl={signer?.logoUri || undefined}
                shortenHash={4}
              />
            </StepLabel>
          </StyledStep>
        ))}
      {detailedExecutionInfo.confirmations.length > 0 && (
        <StyledStep color="green">
          <StepLabel icon={<DotIcon strokeWidth={14} />} onClick={toggleHide} style={{ cursor: 'pointer' }}>
            {hideConfirmations ? 'Show all' : 'Hide all'}
          </StepLabel>
        </StyledStep>
      )}
      <StyledStep expanded bold color={isExecuted ? 'green' : 'gray'}>
        <StepLabel icon={isExecuted ? <CheckIcon /> : <CircleIcon />}>
          {isExecuted ? 'Executed' : isPending ? 'Executing' : 'Execution'}
        </StepLabel>
        {!isConfirmed && !isPending && (
          <StepContent>
            {detailedExecutionInfo.executor ? (
              <AddressInfo
                address={detailedExecutionInfo.executor.value}
                name={detailedExecutionInfo.executor?.name || undefined}
                avatarUrl={detailedExecutionInfo.executor?.logoUri || undefined}
                shortenHash={4}
              />
            ) : (
              'Can be executed once the threshold is reached'
            )}
          </StepContent>
        )}
      </StyledStep>
    </StyledStepper>
  )
}
