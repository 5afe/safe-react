import { CopyToClipboardBtn } from '@gnosis.pm/safe-react-components'
import { ReactElement } from 'react'
import { generatePath } from 'react-router-dom'

import { getPrefixedSafeAddressSlug, SAFE_ADDRESS_SLUG, SAFE_ROUTES, TRANSACTION_HASH_SLUG } from 'src/routes/routes'
import { PUBLIC_URL } from 'src/utils/constants'

type Props = {
  safeTxHash: string
}

const TxShareButton = ({ safeTxHash }: Props): ReactElement => {
  const txDetailsPathname = generatePath(SAFE_ROUTES.TRANSACTIONS_SINGULAR, {
    [SAFE_ADDRESS_SLUG]: getPrefixedSafeAddressSlug(),
    [TRANSACTION_HASH_SLUG]: safeTxHash,
  })
  const txDetailsLink = `${window.location.origin}${PUBLIC_URL}${txDetailsPathname}`

  return <CopyToClipboardBtn textToCopy={txDetailsLink} iconType="share" />
}

export default TxShareButton
