import { Text } from '@gnosis.pm/safe-react-components'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import styled from 'styled-components'

import { styles } from './styles'

import {
  isAddress,
  isArrayParameter,
} from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/utils'
import { useWindowDimensions } from 'src/routes/safe/container/hooks/useWindowDimensions'
import EtherscanLink from 'src/components/EtherscanLink'

const useStyles = makeStyles(styles)

const InlineText = styled(Text)`
  display: inline-flex;
`

const NestedWrapper = styled.div`
  text-indent: 24px;
`

interface RenderValueProps {
  method: string
  type: string
  value: string | string[]
}

const RenderEtherscanLink = ({ method, type, value }: RenderValueProps): React.ReactElement => {
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
          <EtherscanLink key={`${method}-value-${index}`} cut={cut} value={value} />
        ))}
      </NestedWrapper>
    )
  }

  return <EtherscanLink className={classes.address} cut={cut} value={value as string} />
}

const RenderGenericValue = ({ method, type, value }: RenderValueProps): React.ReactElement => {
  if (isArrayParameter(type)) {
    return (
      <NestedWrapper>
        {(value as string[]).map((value, index) => (
          <Text key={`${method}-value-${index}`} size="lg">
            {value}
          </Text>
        ))}
      </NestedWrapper>
    )
  }

  return <InlineText size="lg">{value as string}</InlineText>
}

const RenderValue = ({ type, ...props }: RenderValueProps): React.ReactElement => {
  if (isAddress(type)) {
    return <RenderEtherscanLink type={type} {...props} />
  }

  return <RenderGenericValue type={type} {...props} />
}

export default RenderValue
