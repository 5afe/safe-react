import { EthHashInfo, Text } from '@gnosis.pm/safe-react-components'
import { ReactElement } from 'react'
import { useSelector } from 'react-redux'

import { addressBookEntryName } from 'src/logic/addressBook/store/selectors'
import { ADDRESS_BOOK_DEFAULT_NAME } from 'src/logic/addressBook/model/addressBook'
import { sameString } from 'src/utils/strings'
import { currentBlockExplorerInfo } from 'src/logic/config/store/selectors'
import { AppReduxState } from 'src/store'

interface AddressInfoProps {
  address: string
  title?: string
}

const AddressInfo = ({ address, title }: AddressInfoProps): ReactElement => {
  const name = useSelector((state) => addressBookEntryName(state, { address }))
  const explorerUrl = useSelector((state: AppReduxState) => currentBlockExplorerInfo(state, address))

  return (
    <>
      {title && (
        <Text size="xl" strong>
          {title}
        </Text>
      )}
      <EthHashInfo
        hash={address}
        name={sameString(name, ADDRESS_BOOK_DEFAULT_NAME) ? undefined : name}
        showCopyBtn
        showAvatar
        textSize="lg"
        explorerUrl={explorerUrl}
      />
    </>
  )
}

export default AddressInfo
