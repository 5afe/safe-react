import { CopyToClipboardBtn } from '@gnosis.pm/safe-react-components'
import { generatePath } from 'react-router-dom'

import { getPrefixedSafeAddressSlug, SAFE_ADDRESS_SLUG, SAFE_ROUTES, TRANSACTION_HASH_SLUG } from 'src/routes/routes'
import { PUBLIC_URL } from 'src/utils/constants'

type Props = {
  safeTxHash: string
}

const TxShareButton = ({ safeTxHash }: Props) => {
  const txDetailsPathname = generatePath(SAFE_ROUTES.TRANSACTIONS, {
    [SAFE_ADDRESS_SLUG]: getPrefixedSafeAddressSlug(),
    [TRANSACTION_HASH_SLUG]: safeTxHash,
  })
  const txDetailsLink = `${window.location.origin}${PUBLIC_URL}${txDetailsPathname}`

  return <CopyToClipboardBtn textToCopy={txDetailsLink} /> //TODO: iconType="share" tooltip="Copy transaction link to clipboard" />
}

export default TxShareButton
