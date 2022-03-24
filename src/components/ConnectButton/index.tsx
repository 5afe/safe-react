import { ReactElement } from 'react'

import Button from 'src/components/layout/Button'
import { useOnboard } from 'src/logic/wallets/onboard/useOnboard'
import { OVERVIEW_EVENTS } from 'src/utils/events/overview'
import Track from '../Track'

const ConnectButton = (props: { 'data-testid': string }): ReactElement => {
  const { connect } = useOnboard()

  const onConnect = async () => await connect()

  return (
    <Track {...OVERVIEW_EVENTS.ONBOARD}>
      <Button color="primary" minWidth={240} onClick={onConnect} variant="contained" {...props}>
        Connect
      </Button>
    </Track>
  )
}

export default ConnectButton
