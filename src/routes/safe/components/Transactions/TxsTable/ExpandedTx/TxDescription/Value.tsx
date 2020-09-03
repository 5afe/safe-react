import { Text } from '@gnosis.pm/safe-react-components'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import styled from 'styled-components'

import { styles } from './styles'

import {
  isAddress,
  isArrayParameter,
} from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/utils'
import { useWindowDimensions } from 'src/logic/hooks/useWindowDimensions'
import SafeEtherscanLink from 'src/components/EtherscanLink'

const useStyles = makeStyles(styles)

const NestedWrapper = styled.div`
  padding-left: 4px;
`

const StyledText = styled(Text)`
  white-space: normal;
`

interface RenderValueProps {
  method: string
  type: string
  value: string | unknown[]
}

const EtherscanLink = ({ method, type, value }: RenderValueProps): React.ReactElement => {
  const classes = useStyles()
  const [cut, setCut] = React.useState(undefined)
  const { width } = useWindowDimensions()

  React.useEffect(() => {
    if (width <= 900) {
      setCut(4)
    } else if (width <= 1024) {
      setCut(8)
    } else {
      setCut(12)
    }
  }, [width])

  if (isArrayParameter(type)) {
    return (
      <NestedWrapper>
        {(value as string[]).map((value, index) => (
          <SafeEtherscanLink type="address" key={`${method}-value-${index}`} cut={cut} value={value} />
        ))}
      </NestedWrapper>
    )
  }

  return <SafeEtherscanLink type="address" className={classes.address} cut={cut} value={value as string} />
}

const GenericValue = ({ method, type, value }: RenderValueProps): React.ReactElement => {
  const getTextValue = (value: string) => <StyledText size="lg">{value}</StyledText>

  const getArrayValue = (parentId: string, value: unknown[] | string) => (
    <div>
      [
      <NestedWrapper>
        {(value as string[]).map((currentValue, index) => {
          const key = `${parentId}-value-${index}`
          return (
            <div key={key}>
              {Array.isArray(currentValue) ? getArrayValue(key, currentValue) : getTextValue(currentValue)}
            </div>
          )
        })}
      </NestedWrapper>
      ]
    </div>
  )

  if (isArrayParameter(type) || Array.isArray(value)) {
    return getArrayValue(method, value)
  }

  return getTextValue(value as string)
}

const Value = ({ type, ...props }: RenderValueProps): React.ReactElement => {
  if (isAddress(type)) {
    return <EtherscanLink type={type} {...props} />
  }

  return <GenericValue type={type} {...props} />
}

export default Value
