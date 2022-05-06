import { ReactElement } from 'react'
import AlertTooltipWarning from './AlertTooltipWarning'

const ThresholdWarning = (): ReactElement => (
  <AlertTooltipWarning
    tooltip="This transaction alters the number of confirmations required to execute a transaction."
    warning="Confirmation policy change"
  />
)

export default ThresholdWarning
