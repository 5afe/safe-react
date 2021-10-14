import { IconText, Text } from '@gnosis.pm/safe-react-components'
import { ReactElement } from 'react'

import Row from 'src/components/layout/Row'

interface ResetTimeInfoProps {
  title?: string
  label?: string
}

const ResetTimeInfo = ({ title, label }: ResetTimeInfoProps): ReactElement => (
  <>
    <Text size="xl" strong>
      {title}
    </Text>
    {label ? (
      <Row align="center" margin="md">
        <IconText iconSize="md" iconType="fuelIndicator" text={label} textSize="lg" />
      </Row>
    ) : (
      <Row align="center" margin="md">
        <Text size="lg">One-time spending limit</Text>
      </Row>
    )}
  </>
)

export default ResetTimeInfo
