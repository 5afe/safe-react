import { Icon, Link, Text } from '@gnosis.pm/safe-react-components'
import { Box, IconButton } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { FETCH_STATUS } from 'src/utils/requests'
import { TenderlySimulation } from './types'

type SimulationResultProps = {
  simulationRequestStatus: string
  simulation?: TenderlySimulation
  simulationLink?: string
  requestError?: string
  onClose: () => void
}

export const SimulationResult = ({
  simulationRequestStatus,
  simulation,
  simulationLink,
  requestError,
  onClose,
}: SimulationResultProps): React.ReactElement => {
  const isErroneous = !!requestError || !simulation?.simulation.status
  const isSimulationFinished =
    simulationRequestStatus === FETCH_STATUS.SUCCESS || simulationRequestStatus === FETCH_STATUS.ERROR

  return (
    <>
      {isSimulationFinished && (
        <Box
          bgcolor={isErroneous ? '#FFF3F5' : '#EFFAF8'}
          alignItems="center"
          margin="0px"
          padding="24px"
          borderRadius="8px"
        >
          {isErroneous ? (
            <>
              <Box display="flex" sx={{ gridGap: '4px' }}>
                <Icon type="alert" color="error" size="sm" />
                <Text color={'error'} size="lg">
                  <b>Failed</b>
                </Text>
                <IconButton style={{ marginLeft: 'auto', padding: '0px' }} disableRipple onClick={onClose} size="small">
                  <Close fontSize="small" />
                </IconButton>
              </Box>
              {requestError ? (
                <Text color="error" size="lg">
                  An unexpected error occured during simulation: <b>{requestError}</b>
                </Text>
              ) : (
                <Text color="inputFilled" size="lg">
                  The batch failed during the simulation throwing error <b>{simulation?.transaction.error_message}</b>{' '}
                  in the contract at <b>{simulation?.transaction.error_info?.address}</b>. Full simulation report is
                  available{' '}
                  <Link href={simulationLink} target="_blank" rel="noreferrer" size="lg">
                    <b>on Tenderly</b>
                  </Link>
                  .
                </Text>
              )}
            </>
          ) : (
            <>
              <Box display="flex" paddingBottom={'8px'} sx={{ gridGap: '4px' }}>
                <Icon type="check" color="primary" size="sm" />
                <Text color={'primary'} size="lg">
                  <b>Success</b>
                </Text>
                <IconButton style={{ marginLeft: 'auto', padding: '0px' }} disableRipple onClick={onClose} size="small">
                  <Close fontSize="small" />
                </IconButton>
              </Box>
              <Text color="inputFilled" size="lg">
                The batch was successfully simulated. Full simulation report is available{' '}
                <Link href={simulationLink} target="_blank" rel="noreferrer" size="lg">
                  <b>on Tenderly</b>
                </Link>
                .
              </Text>
            </>
          )}
        </Box>
      )}
    </>
  )
}
