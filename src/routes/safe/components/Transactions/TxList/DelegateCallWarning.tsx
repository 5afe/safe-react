import { ReactElement } from 'react'

import AlertTooltipWarning from './AlertTooltipWarning'

const DelegateCallWarning = ({ showWarning = false }: { showWarning: boolean }): ReactElement => (
  <AlertTooltipWarning
    tooltip="This transaction calls a smart contract that will be able to modify your Safe."
    message={showWarning ? 'Unexpected Delegate Call' : 'Delegate Call'}
    isWarning={showWarning}
  />
)

export default DelegateCallWarning
