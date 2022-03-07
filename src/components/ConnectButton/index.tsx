import { ReactElement } from 'react'

import Button from 'src/components/layout/Button'
import { useOnboard } from 'src/logic/wallets/onboard/useOnboard'

const ConnectButton = (props: { 'data-testid': string }): ReactElement => {
  const { connect } = useOnboard()

  const onConnect = async () => await connect()

  return (
    <Button color="primary" minWidth={240} onClick={onConnect} variant="contained" {...props}>
      Connect
    </Button>
  )
}

export default ConnectButton
