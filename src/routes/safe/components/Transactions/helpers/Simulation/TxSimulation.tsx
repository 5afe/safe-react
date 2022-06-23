import { BaseTransaction } from '@gnosis.pm/safe-apps-sdk'
import styled from 'styled-components'

import { Accordion, AccordionSummary, Text } from '@gnosis.pm/safe-react-components'
import { Button } from '@material-ui/core'
import { FETCH_STATUS } from 'src/utils/requests'
import { isSimulationAvailable } from './simulation'
import { SimulationResult } from './SimulationResult'
import { useSimulation } from './useSimulation'
import Track from 'src/components/Track'
import { MODALS_EVENTS } from 'src/utils/events/modals'

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

type TxSimulationProps = {
  tx: Omit<BaseTransaction, 'value'>
  canTxExecute: boolean
  gasLimit?: string
}

export const TxSimulation = ({ tx, canTxExecute, gasLimit }: TxSimulationProps): React.ReactElement | null => {
  const { simulateTransaction, simulation, simulationRequestStatus, simulationLink, simulationError, resetSimulation } =
    useSimulation()

  if (!isSimulationAvailable()) {
    return null
  }
  return simulationRequestStatus === FETCH_STATUS.NOT_ASKED || simulationRequestStatus === FETCH_STATUS.LOADING ? (
    <Accordion compact expanded={false}>
      <StyledAccordionSummary>
        <Text size="xl">Transaction validity</Text>
        <Track {...MODALS_EVENTS.SIMULATE_TX}>
          <Button
            variant="text"
            color="secondary"
            onClick={() => simulateTransaction(tx.data, tx.to, canTxExecute, gasLimit)}
          >
            Simulate
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
          simulationError={simulationError}
        />
      </StyledResultAccordionSummary>
    </Accordion>
  )
}
