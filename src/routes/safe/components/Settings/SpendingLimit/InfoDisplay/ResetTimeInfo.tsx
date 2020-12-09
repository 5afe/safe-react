import { IconText, Text } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'

import Row from 'src/components/layout/Row'

import DataDisplay from './DataDisplay'

interface ResetTimeInfoProps {
  title?: string
  label?: string
}

const ResetTimeInfo = ({ title, label }: ResetTimeInfoProps): ReactElement => {
  return (
    <DataDisplay title={title}>
      {label ? (
        <Row align="center" margin="md">
          <IconText iconSize="md" iconType="fuelIndicator" text={label} textSize="lg" />
        </Row>
      ) : (
        <Row align="center" margin="md">
          <Text size="lg">One-time spending limit</Text>
        </Row>
      )}
    </DataDisplay>
  )
}

export default ResetTimeInfo
