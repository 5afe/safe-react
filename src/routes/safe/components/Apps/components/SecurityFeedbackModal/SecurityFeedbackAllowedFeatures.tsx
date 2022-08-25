import React from 'react'
import { Icon, Text } from '@gnosis.pm/safe-react-components'

import { AllowedFeatures, AllowedFeatureSelection } from 'src/routes/safe/components/Apps/types'
import { StyledSecurityTitle } from 'src/routes/safe/components/Apps/components/SecurityFeedbackModal/styles'
import PermissionsCheckbox from 'src/routes/safe/components/Apps/components/PermissionCheckbox'
import { BROWSER_PERMISSIONS_TEXTS } from 'src/routes/safe/components/Apps/hooks/permissions'
import { Box } from '@material-ui/core'

type SecurityFeedbackAllowedFeaturesProps = {
  features: AllowedFeatureSelection[]
  onFeatureSelectionChange: (feature: AllowedFeatures, checked: boolean) => void
}

const SecurityFeedbackAllowedFeatures: React.FC<SecurityFeedbackAllowedFeaturesProps> = ({
  features,
  onFeatureSelectionChange,
}): React.ReactElement => {
  return (
    <>
      <Icon size="md" type="privacyPolicy" />
      <StyledSecurityTitle size="lg">Manage the features Safe App can use</StyledSecurityTitle>
      <Box mx={1} my={3}>
        <Text size="xl">This app is requesting permission to use:</Text>
        <br />
        <Box display="flex" flexDirection="column" ml={2}>
          {features.map(({ feature, checked }, index) => (
            <PermissionsCheckbox
              key={index}
              name="checkbox"
              checked={checked}
              onChange={(_, checked) => onFeatureSelectionChange(feature, checked)}
              label={BROWSER_PERMISSIONS_TEXTS[feature].displayName}
            />
          ))}
        </Box>
      </Box>
    </>
  )
}

export default SecurityFeedbackAllowedFeatures
