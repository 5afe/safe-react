import { BaseTransaction } from '@gnosis.pm/safe-apps-sdk'
import styled from 'styled-components'

import { Accordion, AccordionSummary, Loader, Text } from '@gnosis.pm/safe-react-components'
import { Button } from '@material-ui/core'
import { FETCH_STATUS } from 'src/utils/requests'
import { isSimulationAvailable } from './simulation'
import { SimulationResult } from './SimulationResult'
import { useSimulation } from './useSimulation'
import Track from 'src/components/Track'
import { MODALS_EVENTS } from 'src/utils/events/modals'
import { useSelector } from 'react-redux'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { getWeb3 } from 'src/logic/wallets/getWeb3'

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

export const TxSimulation = ({
  tx,
  canTxExecute,
  gasLimit,
  disabled,
}: TxSimulationProps): React.ReactElement | null => {
  const { simulateTransaction, simulation, simulationRequestStatus, simulationLink, requestError, resetSimulation } =
    useSimulation()
  const { chainId, address: safeAddress } = useSelector(currentSafe)
  const userAddress = useSelector(userAccountSelector)
  const web3 = getWeb3()

  const getBlockGasLimit = async () => {
    const latestBlock = await web3.eth.getBlock('latest')
    return parseInt(latestBlock.gasLimit.toString())
  }

  const handleSimulation = async () => {
    simulateTransaction(
      tx,
      chainId ?? '4',
      safeAddress,
      userAddress,
      canTxExecute,
      Number(gasLimit) ?? (await getBlockGasLimit()),
    )
  }

  if (!isSimulationAvailable()) {
    return null
  }

  const isSimulationFinished =
    simulationRequestStatus === FETCH_STATUS.ERROR || simulationRequestStatus === FETCH_STATUS.SUCCESS
  const isSimulationLoading = simulationRequestStatus === FETCH_STATUS.LOADING
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
