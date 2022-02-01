import { ReactElement, useState } from 'react'
import styled, { AnyStyledComponent } from 'styled-components'
import Step from '@material-ui/core/Step'
import StepConnector from '@material-ui/core/StepConnector'
import StepContent from '@material-ui/core/StepContent'
import StepLabel from '@material-ui/core/StepLabel'
import Stepper from '@material-ui/core/Stepper'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import ControlPointIcon from '@material-ui/icons/ControlPoint'
import RadioButtonUncheckedOutlinedIcon from '@material-ui/icons/RadioButtonUncheckedOutlined'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined'

import { ExpandedTxDetails, isMultiSigExecutionDetails } from 'src/logic/safe/store/models/types/gateway.d'
import { AddressInfo } from 'src/routes/safe/components/Transactions/TxList/AddressInfo'
import { isCancelTxDetails } from 'src/routes/safe/components/Transactions/TxList/utils'
import { black300, gray500, primary400, red400 } from 'src/theme/variables'

// Icons

// All icons from MUI share the same type
const getStyledIcon = (icon: typeof ControlPointIcon): AnyStyledComponent => {
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
  padding: 3px 0;

  .MuiStepConnector-line {
    margin-left: -1px;
    border-color: ${gray500};
    border-left-width: 2px;
    min-height: 14px;
  }
`

type StepColor = 'green' | 'gray' | 'orange' | 'red'
const getStepColor = (color: StepColor): string => {
  switch (color) {
    case 'green':
      return primary400
    case 'gray':
      return black300
    case 'orange':
      return '#e8663d'
    case 'red':
      return red400
  }
}

type StyledStepProps = {
  bold?: boolean
  color: StepColor
}
const StyledStep = styled(Step)<StyledStepProps>`
  .MuiStepLabel-label {
    font-weight: ${({ bold = false }) => (bold ? 'bold' : 'normal')};
    color: ${({ color }) => getStepColor(color)};
  }

  .MuiStepLabel-iconContainer {
    color: ${({ color }) => getStepColor(color)};
    align-items: center;
  }
`

const StyledStepContent = styled(StepContent)`
  color: ${black300};
`

export const TxOwners = ({
  txDetails,
  isPending,
}: {
  txDetails: ExpandedTxDetails
  isPending: boolean
}): ReactElement | null => {
  const [showConfirmations, setShowConfirmations] = useState<boolean>(false)
  const toggleHide = () => {
    setShowConfirmations((prev) => !prev)
  }

  const { txInfo, detailedExecutionInfo } = txDetails

  if (!detailedExecutionInfo || !isMultiSigExecutionDetails(detailedExecutionInfo)) {
    return null
  }

  const confirmationsNeeded = detailedExecutionInfo.confirmationsRequired - detailedExecutionInfo.confirmations.length
  const isConfirmed = confirmationsNeeded <= 0
  const isExecuted = !!detailedExecutionInfo.executor

  return (
    <StyledStepper orientation="vertical" nonLinear connector={<StyledStepConnector />}>
      {isCancelTxDetails(txInfo) ? (
        <StyledStep bold color="red">
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
          <span style={{ color: black300, fontWeight: 'normal' }}>
            ({`${detailedExecutionInfo.confirmations.length} of ${detailedExecutionInfo.confirmationsRequired}`})
          </span>
        </StepLabel>
      </StyledStep>
      {showConfirmations &&
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
          <StepLabel icon={<DotIcon />} onClick={toggleHide} style={{ cursor: 'pointer' }}>
            {showConfirmations ? 'Hide all' : 'Show all'}
          </StepLabel>
        </StyledStep>
      )}
      <StyledStep expanded bold color={isExecuted ? 'green' : 'gray'}>
        <StepLabel icon={isExecuted ? <CheckIcon /> : <CircleIcon />}>
          {isExecuted ? 'Executed' : isPending ? 'Executing' : 'Execution'}
        </StepLabel>
        {!isPending && !isExecuted && (
          <StyledStepContent>
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
          </StyledStepContent>
        )}
      </StyledStep>
    </StyledStepper>
  )
}
