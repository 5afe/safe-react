import { ReactElement } from 'react'

import Link from 'src/components/layout/Link'
import AlertTooltipWarning from './AlertTooltipWarning'

const UNEXPECTED_DELEGATE_ARTICLE =
  'https://help.gnosis-safe.io/en/articles/6302452-why-do-i-see-an-unexpected-delegate-call-warning-in-my-transaction'

const DelegateCallWarning = ({ showWarning = false }: { showWarning: boolean }): ReactElement => (
  <AlertTooltipWarning
    tooltip={
      <>
        This transaction calls a smart contract that will be able to modify your Safe.
        {showWarning && (
          <>
            <br />
            <Link href={UNEXPECTED_DELEGATE_ARTICLE} rel="noopener noreferrer" target="_blank">
              Learn more
            </Link>
          </>
        )}
      </>
    }
    message={showWarning ? 'Unexpected Delegate Call' : 'Delegate Call'}
    isWarning={showWarning}
  />
)

export default DelegateCallWarning
