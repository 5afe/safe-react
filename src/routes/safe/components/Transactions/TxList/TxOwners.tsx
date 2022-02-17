import { ReactElement, useState, CSSProperties } from 'react'
import styled, { AnyStyledComponent } from 'styled-components'
import Step from '@material-ui/core/Step'
import StepConnector from '@material-ui/core/StepConnector'
import StepContent from '@material-ui/core/StepContent'
import StepLabel from '@material-ui/core/StepLabel'
import Stepper from '@material-ui/core/Stepper'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import RadioButtonUncheckedOutlinedIcon from '@material-ui/icons/RadioButtonUncheckedOutlined'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import CancelIcon from '@material-ui/icons/Cancel'
import { AddressEx, DetailedExecutionInfo } from '@gnosis.pm/safe-react-gateway-sdk'
import { useSelector } from 'react-redux'

import { ExpandedTxDetails, isMultiSigExecutionDetails } from 'src/logic/safe/store/models/types/gateway.d'
import { AddressInfo } from 'src/routes/safe/components/Transactions/TxList/AddressInfo'
import { isCancelTxDetails } from 'src/routes/safe/components/Transactions/TxList/utils'
import { black300, gray500, primary400, red400, orange500 } from 'src/theme/variables'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { currentChainId } from 'src/logic/config/store/selectors'
import { addressBookName } from 'src/logic/addressBook/store/selectors'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'

// Icons

// All icons from MUI share the same type
const getStyledIcon = (icon: typeof AddCircleIcon): AnyStyledComponent => {
  return styled(icon)`
    height: 20px;
    width: 20px;
    margin-left: 2px;
  `
}

const TxCreationIcon = getStyledIcon(AddCircleIcon)
const TxRejectionIcon = getStyledIcon(CancelIcon)
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

type StepState = 'confirmed' | 'active' | 'disabled' | 'error'
const getStepColor = (state: StepState): string => {
  switch (state) {
    case 'confirmed':
      return primary400
    case 'active':
      return orange500
    case 'disabled':
      return black300
    case 'error':
      return red400
  }
}

type StyledStepProps = {
  $bold?: boolean
  state: StepState
}
const StyledStep = styled(Step)<StyledStepProps>`
  .MuiStepLabel-label {
    font-weight: ${({ $bold = false }) => ($bold ? 'bold' : 'normal')};
    font-size: 16px;
    color: ${({ state }) => getStepColor(state)};
  }

  .MuiStepLabel-iconContainer {
    color: ${({ state }) => getStepColor(state)};
    align-items: center;
  }
`

const StyledStepContent = styled(StepContent)`
  color: ${black300};
`

// Simple memoized styles
const pointerStyle: CSSProperties = {
  cursor: 'pointer',
}

const confirmationsStyle: CSSProperties = {
  color: black300,
  fontWeight: 'normal',
}

const shouldHideConfirmations = (detailedExecutionInfo: DetailedExecutionInfo | null): boolean => {
  if (!detailedExecutionInfo || !isMultiSigExecutionDetails(detailedExecutionInfo)) {
    return true
  }

  const confirmationsNeeded = detailedExecutionInfo.confirmationsRequired - detailedExecutionInfo.confirmations.length
  const isConfirmed = confirmationsNeeded <= 0

  // Threshold reached or more than 3 confirmations
  return isConfirmed || detailedExecutionInfo.confirmations.length > 3
}

const getConfirmationStep = (
  { value, name, logoUri }: AddressEx,
  key: string | undefined = undefined,
): ReactElement => (
  <StyledStep key={key} $bold state="confirmed">
    <StepLabel icon={<DotIcon />}>
      <AddressInfo address={value} name={name || undefined} avatarUrl={logoUri || undefined} shortenHash={4} />
    </StepLabel>
  </StyledStep>
)

export const TxOwners = ({
  txDetails,
  isPending,
}: {
  txDetails: ExpandedTxDetails
  isPending: boolean
}): ReactElement | null => {
  const { txInfo, detailedExecutionInfo } = txDetails

  const [hideConfirmations, setHideConfirmations] = useState<boolean>(shouldHideConfirmations(detailedExecutionInfo))

  const { threshold } = useSelector(currentSafe)
  const account = useSelector(userAccountSelector)
  const chainId = useSelector(currentChainId)
  const name = useSelector((state) => addressBookName(state, { address: account, chainId }))

  const toggleHide = () => {
    setHideConfirmations((prev) => !prev)
  }

  if (!detailedExecutionInfo || !isMultiSigExecutionDetails(detailedExecutionInfo)) {
    return null
  }

  const confirmationsNeeded = detailedExecutionInfo.confirmationsRequired - detailedExecutionInfo.confirmations.length

  const isImmediateExecution = isPending && threshold === 1
  const isConfirmed = confirmationsNeeded <= 0 || isImmediateExecution
  const isExecuted = !!detailedExecutionInfo.executor

  const numberOfConfirmations = isImmediateExecution ? 1 : detailedExecutionInfo.confirmations.length
  return (
    <StyledStepper orientation="vertical" nonLinear connector={<StyledStepConnector />}>
      {isCancelTxDetails(txInfo) ? (
        <StyledStep $bold state="error">
          <StepLabel icon={<TxRejectionIcon />}>On-chain rejection created</StepLabel>
        </StyledStep>
      ) : (
        <StyledStep $bold state="confirmed">
          <StepLabel icon={<TxCreationIcon />}>Created</StepLabel>
        </StyledStep>
      )}
      <StyledStep $bold state={isConfirmed ? 'confirmed' : 'active'}>
        <StepLabel icon={isConfirmed ? <CheckIcon /> : <CircleIcon />}>
          Confirmations{' '}
          <span style={confirmationsStyle}>
            ({`${numberOfConfirmations} of ${detailedExecutionInfo.confirmationsRequired}`})
          </span>
        </StepLabel>
      </StyledStep>
      {!hideConfirmations &&
        (isImmediateExecution
          ? getConfirmationStep({ value: account, name, logoUri: null })
          : detailedExecutionInfo.confirmations.map(({ signer }) => getConfirmationStep(signer, signer.value)))}
      {detailedExecutionInfo.confirmations.length > 0 && (
        <StyledStep state="confirmed">
          <StepLabel icon={<DotIcon />} onClick={toggleHide}>
            <span style={pointerStyle}>{hideConfirmations ? 'Show all' : 'Hide all'}</span>
          </StepLabel>
        </StyledStep>
      )}
      <StyledStep expanded $bold state={isExecuted ? 'confirmed' : 'disabled'}>
        <StepLabel icon={isExecuted ? <CheckIcon /> : <CircleIcon />}>
          {isExecuted ? 'Executed' : isPending ? 'Executing' : 'Execution'}
        </StepLabel>
        {
          // isExecuted
          detailedExecutionInfo.executor ? (
            <StepContent>
              <AddressInfo
                address={detailedExecutionInfo.executor.value}
                name={detailedExecutionInfo.executor.name || undefined}
                avatarUrl={detailedExecutionInfo.executor.logoUri || undefined}
                shortenHash={4}
              />
            </StepContent>
          ) : (
            !isConfirmed &&
            !isPending && <StyledStepContent>Can be executed once the threshold is reached</StyledStepContent>
          )
        }
      </StyledStep>
    </StyledStepper>
  )
}
