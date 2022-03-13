import { SettingsChange, SettingsInfo } from '@gnosis.pm/safe-react-gateway-sdk'
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
      return (
        <InfoDetails title="Set fallback handler:">
          <AddressInfo
            address={settingsInfo.handler.value}
            name={settingsInfo.handler?.name || undefined}
            avatarUrl={settingsInfo.handler?.logoUri || undefined}
          />
        </InfoDetails>
      )
    }
    case 'ADD_OWNER':
    case 'REMOVE_OWNER': {
      const title = settingsInfo.type === 'ADD_OWNER' ? 'Add owner:' : 'Remove owner:'
      return (
        <InfoDetails title={title}>
          <AddressInfo
            address={settingsInfo.owner.value}
            name={settingsInfo.owner?.name || undefined}
            avatarUrl={settingsInfo.owner?.logoUri || undefined}
          />
          <InfoDetails title="Change required confirmations:">{settingsInfo.threshold}</InfoDetails>
        </InfoDetails>
      )
    }
    case 'SWAP_OWNER': {
      return (
        <InfoDetails title="Swap owner:">
          <TxInfoDetails
            title="Old owner"
            address={settingsInfo.oldOwner.value}
            name={settingsInfo.oldOwner?.name || undefined}
            avatarUrl={settingsInfo.oldOwner?.logoUri || undefined}
          />
          <TxInfoDetails
            title="New owner"
            address={settingsInfo.newOwner.value}
            name={settingsInfo.newOwner?.name || undefined}
            avatarUrl={settingsInfo.newOwner?.logoUri || undefined}
          />
        </InfoDetails>
      )
    }
    case 'CHANGE_THRESHOLD': {
      return <InfoDetails title="Change required confirmations:">{settingsInfo.threshold}</InfoDetails>
    }
    case 'CHANGE_IMPLEMENTATION': {
      return (
        <InfoDetails title="Change implementation:">
          <AddressInfo
            address={settingsInfo.implementation.value}
            name={settingsInfo.implementation?.name || undefined}
            avatarUrl={settingsInfo.implementation?.logoUri || undefined}
          />
        </InfoDetails>
      )
    }
    case 'ENABLE_MODULE':
    case 'DISABLE_MODULE': {
      const title = settingsInfo.type === 'ENABLE_MODULE' ? 'Enable module:' : 'Disable module:'
      return (
        <InfoDetails title={title}>
          <AddressInfo
            address={settingsInfo.module.value}
            name={settingsInfo.module?.name || undefined}
            avatarUrl={settingsInfo.module?.logoUri || undefined}
          />
        </InfoDetails>
      )
    }
    case 'SET_GUARD': {
      return (
        <InfoDetails title="Set guard:">
          <AddressInfo
            address={settingsInfo.guard.value}
            name={settingsInfo.guard?.name || undefined}
            avatarUrl={settingsInfo.guard?.logoUri || undefined}
          />
        </InfoDetails>
      )
    }
    case 'DELETE_GUARD': {
      return <InfoDetails title="Delete guard">{null}</InfoDetails>
    }
    default:
      return <InfoDetails title={(settingsInfo as SettingsInfo).type}>{null}</InfoDetails>
  }
}
