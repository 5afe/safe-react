import { CopyToClipboardBtn } from '@gnosis.pm/safe-react-components'
import { ReactElement } from 'react'
import { generatePath } from 'react-router-dom'
import useSafeAddress from 'src/logic/currentSession/hooks/useSafeAddress'

import { getPrefixedSafeAddressSlug, SAFE_ADDRESS_SLUG, SAFE_ROUTES, TRANSACTION_ID_SLUG } from 'src/routes/routes'
import { PUBLIC_URL } from 'src/utils/constants'
import styled from 'styled-components'
import { primaryLite, background } from 'src/theme/variables'

type Props = {
  txId: string
}

const StyledCopyToClipboardBtn = styled(CopyToClipboardBtn)`
  background: ${background};
  border-radius: 4px;
  height: 32px;
  width: 32px;

  &:hover {
    background: ${primaryLite};
  }

  & span {
    width: 32px;
    height: 32px;
    justify-content: center;
    align-items: center;
  }

  & svg {
    padding-right: 2px;
  }
`

const TxShareButton = ({ txId }: Props): ReactElement => {
  const { shortName, safeAddress } = useSafeAddress()

  const txDetailsPathname = generatePath(SAFE_ROUTES.TRANSACTIONS_SINGULAR, {
    [SAFE_ADDRESS_SLUG]: getPrefixedSafeAddressSlug({ shortName, safeAddress }),
    [TRANSACTION_ID_SLUG]: txId,
  })
  const txDetailsLink = `${window.location.origin}${PUBLIC_URL}${txDetailsPathname}`

  return <StyledCopyToClipboardBtn textToCopy={txDetailsLink} iconType="share" />
}

export default TxShareButton
