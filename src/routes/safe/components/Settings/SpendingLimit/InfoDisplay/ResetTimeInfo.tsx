import { IconText, Text } from '@gnosis.pm/safe-react-components'
import { ThemeColors } from '@gnosis.pm/safe-react-components/dist/theme'
import { ReactElement } from 'react'

import Row from 'src/components/layout/Row'

interface ResetTimeInfoProps {
  title?: string
  label?: string
  color?: ThemeColors
}

const ResetTimeInfo = ({ title, label, color }: ResetTimeInfoProps): ReactElement => (
  <>
    <Text size="xl" color={color}>
      {title}
    </Text>
    {label ? (
      <Row align="center" margin="md">
        <IconText iconSize="md" iconType="fuelIndicator" text={label} textSize="lg" />
      </Row>
    ) : (
      <Row align="center">
        <Text size="xl">One-time spending limit</Text>
      </Row>
    )}
  </>
)

export default ResetTimeInfo
