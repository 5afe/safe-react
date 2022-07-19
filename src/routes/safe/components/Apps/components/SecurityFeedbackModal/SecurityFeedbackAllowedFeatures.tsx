import { Checkbox } from '@gnosis.pm/safe-react-components'
import React from 'react'
import { AllowedFeatures } from '../../types'

type SecurityFeedbackAllowedFeaturesProps = {
  features: { feature: AllowedFeatures; checked: boolean }[]
  onFeatureSelectionChange: (feature: AllowedFeatures, checked: boolean) => void
}

const SecurityFeedbackAllowedFeatures: React.FC<SecurityFeedbackAllowedFeaturesProps> = ({
  features,
  onFeatureSelectionChange,
}): React.ReactElement => {
  return (
    <>
      <p>Hello SecurityFeedbackAllowedFeatures</p>
      {features.map(({ feature, checked }, index) => (
        <Checkbox
          key={index}
          name="checkbox"
          checked={checked}
          onChange={(_, checked) => onFeatureSelectionChange(feature, checked)}
          label={feature}
        />
      ))}
    </>
  )
}

export default SecurityFeedbackAllowedFeatures
