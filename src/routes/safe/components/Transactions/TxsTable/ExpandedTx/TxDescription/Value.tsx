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
  text-indent: 24px;
`

const StyledText = styled(Text)`
  white-space: normal;
`

interface RenderValueProps {
  method: string
  type: string
  value: string | string[]
}

const EtherscanLink = ({ method, type, value }: RenderValueProps): React.ReactElement => {
  const classes = useStyles()
  const [cut, setCut] = React.useState(0)
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
  if (isArrayParameter(type)) {
    return (
      <NestedWrapper>
        {(value as string[]).map((value, index) => (
          <StyledText key={`${method}-value-${index}`} size="lg">
            {value}
          </StyledText>
        ))}
      </NestedWrapper>
    )
  }

  return <StyledText size="lg">{value as string}</StyledText>
}

const Value = ({ type, ...props }: RenderValueProps): React.ReactElement => {
  if (isAddress(type)) {
    return <EtherscanLink type={type} {...props} />
  }

  return <GenericValue type={type} {...props} />
}

export default Value
