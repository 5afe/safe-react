import { ReactElement } from 'react'
import { BaseTransaction } from '@gnosis.pm/safe-apps-sdk'
import styled from 'styled-components'

import { Accordion, AccordionSummary, Loader, Text } from '@gnosis.pm/safe-react-components'
import { Button } from '@material-ui/core'
import { FETCH_STATUS } from 'src/utils/requests'
import { isSimulationEnvSet } from './simulation'
import { SimulationResult } from './SimulationResult'
import { useSimulation } from './useSimulation'
import Track from 'src/components/Track'
import { MODALS_EVENTS } from 'src/utils/events/modals'
import { useSelector } from 'react-redux'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import useAsync from 'src/logic/hooks/useAsync'
import { FEATURES } from '@gnosis.pm/safe-react-gateway-sdk'
import { hasFeature } from 'src/logic/safe/utils/safeVersion'

const StyledAccordionSummary = styled(AccordionSummary)`
  & .MuiAccordionSummary-content {
    justify-content: space-between;
    align-items: center;
  }

  & .MuiAccordionSummary-expandIcon {
    display: none;
  }
`

const StyledResultAccordionSummary = styled(AccordionSummary)`
  padding: 0px;
  & .MuiAccordionSummary-content {
    justify-content: space-between;
    align-items: center;
    padding: 0px;
  }

  & .MuiAccordionSummary-expandIcon {
    display: none;
  }
`

const LoaderText = styled.span`
  margin-left: 10px;
`

type TxSimulationProps = {
  tx: Omit<BaseTransaction, 'value'>
  canTxExecute: boolean
  gasLimit?: string
  disabled: boolean
}

const TxSimulationBlock = ({ tx, canTxExecute, gasLimit, disabled }: TxSimulationProps): ReactElement => {
  const { simulateTransaction, simulation, simulationRequestStatus, simulationLink, requestError, resetSimulation } =
    useSimulation()
  const { chainId, address: safeAddress } = useSelector(currentSafe)
  const userAddress = useSelector(userAccountSelector)
  const web3 = getWeb3()

  const [blockGasLimit] = useAsync(async () => {
    const latestBlock = await web3.eth.getBlock('latest')
    return latestBlock.gasLimit
  }, [web3.eth])

  const simulationGasLimit = Number(gasLimit) || blockGasLimit || 0

  const handleSimulation = async () => {
    simulateTransaction(tx, chainId ?? '4', safeAddress, userAddress, canTxExecute, simulationGasLimit)
  }

  const isSimulationFinished =
    simulationRequestStatus === FETCH_STATUS.ERROR || simulationRequestStatus === FETCH_STATUS.SUCCESS
  const isSimulationLoading = simulationRequestStatus === FETCH_STATUS.LOADING || simulationGasLimit === 0
  const showSimulationButton = !isSimulationFinished

  return showSimulationButton ? (
    <Accordion compact expanded={false}>
      <StyledAccordionSummary>
        <Text size="xl">Transaction validity</Text>
        <Track {...MODALS_EVENTS.SIMULATE_TX}>
          <Button
            variant="text"
            disabled={disabled || isSimulationLoading}
            color="secondary"
            onClick={handleSimulation}
          >
            {isSimulationLoading && <Loader size="xs" color="secondaryLight" />}
            <LoaderText>Simulate</LoaderText>
          </Button>
        </Track>
      </StyledAccordionSummary>
    </Accordion>
  ) : (
    <Accordion compact expanded>
      <StyledResultAccordionSummary>
        <SimulationResult
          onClose={resetSimulation}
          simulation={simulation}
          simulationRequestStatus={simulationRequestStatus}
          simulationLink={simulationLink}
          requestError={requestError}
        />
      </StyledResultAccordionSummary>
    </Accordion>
  )
}

export const isTxSimulationEnabled = (): boolean => {
  return isSimulationEnvSet && hasFeature(FEATURES.TX_SIMULATION)
}

export const TxSimulation = (props: TxSimulationProps): ReactElement | null => {
  if (!isTxSimulationEnabled()) {
    return null
  }

  return <TxSimulationBlock {...props} />
}
