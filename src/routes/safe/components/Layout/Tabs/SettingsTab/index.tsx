import Badge from '@material-ui/core/Badge'
import React from 'react'
import { useSelector } from 'react-redux'

import { SettingsIcon } from 'src/routes/safe/components/assets/SettingsIcon'
import { grantedSelector } from 'src/routes/safe/container/selector'
import { safeNeedsUpdateSelector } from 'src/logic/safe/store/selectors'

const SettingsTab = () => {
  const needsUpdate = useSelector(safeNeedsUpdateSelector)
  const granted = useSelector(grantedSelector)

  return (
    <>
      <SettingsIcon />
      <Badge
        badgeContent=""
        color="error"
        invisible={!needsUpdate || !granted}
        style={{ paddingRight: '10px' }}
        variant="dot"
      >
        Settings
      </Badge>
    </>
  )
}

export default SettingsTab
