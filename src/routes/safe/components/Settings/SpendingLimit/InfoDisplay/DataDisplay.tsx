import { Text } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'

interface GenericInfoProps {
  title?: string
  children: React.ReactNode
}

const DataDisplay = ({ title, children }: GenericInfoProps): ReactElement => (
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
