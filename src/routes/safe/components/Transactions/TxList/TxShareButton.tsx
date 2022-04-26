import { CopyToClipboardBtn } from '@gnosis.pm/safe-react-components'
import { ReactElement } from 'react'
import { generatePath } from 'react-router-dom'
import useSafeAddress from 'src/logic/currentSession/hooks/useSafeAddress'

import { getPrefixedSafeAddressSlug, SAFE_ADDRESS_SLUG, SAFE_ROUTES, TRANSACTION_ID_SLUG } from 'src/routes/routes'
import { PUBLIC_URL } from 'src/utils/constants'

type Props = {
  txId: string
}

const TxShareButton = ({ txId }: Props): ReactElement => {
  const { shortName, safeAddress } = useSafeAddress()

  const txDetailsPathname = generatePath(SAFE_ROUTES.TRANSACTIONS_SINGULAR, {
    [SAFE_ADDRESS_SLUG]: getPrefixedSafeAddressSlug({ shortName, safeAddress }),
    [TRANSACTION_ID_SLUG]: txId,
  })
  const txDetailsLink = `${window.location.origin}${PUBLIC_URL}${txDetailsPathname}`

  return <CopyToClipboardBtn textToCopy={txDetailsLink} iconType="share" />
}

export default TxShareButton
