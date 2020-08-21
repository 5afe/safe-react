import { IconText, Text } from '@gnosis.pm/safe-react-components'
import React from 'react'

import Row from 'src/components/layout/Row'

import DataDisplay from './DataDisplay'

interface ResetTimeInfoProps {
  title?: string
  label?: string
}

const ResetTimeInfo = ({ title, label }: ResetTimeInfoProps): React.ReactElement => {
  return (
    <DataDisplay title={title}>
      {label ? (
        <Row align="center" margin="md">
          <IconText iconSize="md" iconType="fuelIndicator" text={label} textSize="lg" />
        </Row>
      ) : (
        <Row align="center" margin="md">
          <Text size="lg">
            {/* TODO: review message */}
            One-time spending limit allowance
          </Text>
        </Row>
      )}
    </DataDisplay>
  )
}

export default ResetTimeInfo
