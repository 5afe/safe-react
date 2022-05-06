import { ReactElement } from 'react'
import AlertTooltipWarning from './AlertTooltipWarning'

const ThresholdWarning = (): ReactElement => (
  <AlertTooltipWarning
    tooltip="This transaction potentially alters the number of confirmations required to execute a transaction."
    message="Confirmation policy change"
    isWarning
  />
)

export default ThresholdWarning
