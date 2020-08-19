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
import SafeEtherscanLink from 'src/components/EtherscanLink'

const useStyles = makeStyles(styles)

const InlineText = styled(Text)`
  display: inline-flex;
`

const NestedWrapper = styled.div`
  text-indent: 24px;
`
type etherscanType = 'address' | 'tx'

interface RenderValueProps {
  method: string
  type: string | etherscanType
  value: string | string[]
}

const EtherscanLink = ({ method, type, value }: RenderValueProps): React.ReactElement => {
  const classes = useStyles()
  const [cut, setCut] = React.useState(undefined)
  const { width } = useWindowDimensions()

  const linkType: etherscanType = ['tx', 'address'].includes(type) ? (type as etherscanType) : 'address'

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
          <SafeEtherscanLink type={linkType} key={`${method}-value-${index}`} cut={cut} value={value} />
        ))}
      </NestedWrapper>
    )
  }

  return <SafeEtherscanLink type={etherscanType} className={classes.address} cut={cut} value={value as string} />
}

const GenericValue = ({ method, type, value }: RenderValueProps): React.ReactElement => {
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

const Value = ({ type, ...props }: RenderValueProps): React.ReactElement => {
  if (isAddress(type)) {
    return <EtherscanLink type={type} {...props} />
  }

  return <GenericValue type={type} {...props} />
}

export default Value
