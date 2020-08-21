import { Text } from '@gnosis.pm/safe-react-components'
import React from 'react'

interface GenericInfoProps {
  title?: string
  children: React.ReactNode
}

const DataDisplay = ({ title, children }: GenericInfoProps): React.ReactElement => (
  <>
    {title && (
      <Text size="lg" color="secondaryLight">
        {title}
      </Text>
    )}
    {children}
  </>
)

export default DataDisplay
