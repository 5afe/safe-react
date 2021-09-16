import { Text } from '@gnosis.pm/safe-react-components'
import { SettingsChange } from '@gnosis.pm/safe-react-gateway-sdk'
import { ReactElement } from 'react'

import { AddressInfo } from './AddressInfo'
import { InfoDetails } from './InfoDetails'
import { TxInfoDetails } from './TxInfoDetails'

type TxInfoSettingsProps = {
  settingsInfo: SettingsChange['settingsInfo']
}

export const TxInfoSettings = ({ settingsInfo }: TxInfoSettingsProps): ReactElement | null => {
  if (!settingsInfo) {
    return null
  }

  switch (settingsInfo.type) {
    case 'SET_FALLBACK_HANDLER': {
      return <InfoDetails title="Set fallback handler:">{settingsInfo.handler}</InfoDetails>
    }
    case 'ADD_OWNER': {
      return (
        <InfoDetails title="Add owner:">
          <AddressInfo address={settingsInfo.owner.value} />
          <InfoDetails title="Change required confirmations:">{settingsInfo.threshold}</InfoDetails>
        </InfoDetails>
      )
    }
    case 'REMOVE_OWNER': {
      return (
        <InfoDetails title="Remove owner:">
          <AddressInfo address={settingsInfo.owner.value} />
          <InfoDetails title="Change required confirmations:">{settingsInfo.threshold}</InfoDetails>
        </InfoDetails>
      )
    }
    case 'SWAP_OWNER': {
      return (
        <InfoDetails title="Swap owner:">
          <TxInfoDetails title="Old owner" address={settingsInfo.oldOwner.value} />
          <TxInfoDetails title="New owner" address={settingsInfo.newOwner.value} />
        </InfoDetails>
      )
    }
    case 'CHANGE_THRESHOLD': {
      return <InfoDetails title="Change required confirmations:">{settingsInfo.threshold}</InfoDetails>
    }
    case 'CHANGE_IMPLEMENTATION': {
      return (
        <InfoDetails title="Change implementation:">
          <Text size="md" strong>
            {settingsInfo.implementation}
          </Text>
        </InfoDetails>
      )
    }
    case 'ENABLE_MODULE': {
      return (
        <InfoDetails title="Enable module:">
          <AddressInfo address={settingsInfo.module.value} />
        </InfoDetails>
      )
    }
    case 'DISABLE_MODULE': {
      return (
        <InfoDetails title="Disable module:">
          <AddressInfo address={settingsInfo.module.value} />
        </InfoDetails>
      )
    }
    default:
      return null
  }
}
