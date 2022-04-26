import { CopyToClipboardBtn } from '@gnosis.pm/safe-react-components'
import { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { generatePath } from 'react-router-dom'
import { currentSafeAddress } from 'src/logic/currentSession/store/selectors'

import {
  extractShortChainName,
  getPrefixedSafeAddressSlug,
  SAFE_ADDRESS_SLUG,
  SAFE_ROUTES,
  TRANSACTION_ID_SLUG,
} from 'src/routes/routes'
import { PUBLIC_URL } from 'src/utils/constants'

type Props = {
  txId: string
}

const TxShareButton = ({ txId }: Props): ReactElement => {
  const safeAddress = useSelector(currentSafeAddress)

  const txDetailsPathname = generatePath(SAFE_ROUTES.TRANSACTIONS_SINGULAR, {
    [SAFE_ADDRESS_SLUG]: getPrefixedSafeAddressSlug({ shortName: extractShortChainName(), safeAddress }),
    [TRANSACTION_ID_SLUG]: txId,
  })
  const txDetailsLink = `${window.location.origin}${PUBLIC_URL}${txDetailsPathname}`

  return <CopyToClipboardBtn textToCopy={txDetailsLink} iconType="share" />
}

export default TxShareButton
