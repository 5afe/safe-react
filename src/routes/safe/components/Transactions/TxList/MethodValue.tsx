import { Text, EthHashInfo } from '@gnosis.pm/safe-react-components'

import styled from 'styled-components'

import {
  isAddress,
  isArrayParameter,
} from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/utils'
import { HexEncodedData } from './HexEncodedData'
import { useSelector } from 'react-redux'
import { currentBlockExplorerInfo } from 'src/logic/config/store/selectors'
import { AppReduxState } from 'src/store'

const NestedWrapper = styled.div`
  padding-left: 4px;
`

interface RenderValueProps {
  method: string
  type: string
  value: string | string[]
}

const GenericValue = ({ method, type, value }: RenderValueProps): React.ReactElement => {
  const getTextValue = (value: string) => <HexEncodedData limit={60} hexData={value} />

  const getArrayValue = (parentId: string, value: string[] | string) => (
    <div>
      [
      <NestedWrapper>
        {(value as string[]).map((currentValue, index) => {
          const key = `${parentId}-value-${index}`
          return Array.isArray(currentValue) ? (
            <Text key={key} size="xl">
              {getArrayValue(key, currentValue)}
            </Text>
          ) : (
            getTextValue(currentValue)
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
  const explorerUrl = useSelector((state: AppReduxState) => currentBlockExplorerInfo(state, props.value as string))

  if (isArrayParameter(type) && isAddress(type)) {
    return (
      <div>
        [
        <NestedWrapper>
          {(props.value as string[]).map((address) => (
            <ArrayValue key={address} address={address} />
          ))}
        </NestedWrapper>
        ]
      </div>
    )
  }

  if (isAddress(type)) {
    return (
      <EthHashInfo textSize="xl" hash={props.value as string} showCopyBtn explorerUrl={explorerUrl} shortenHash={4} />
    )
  }

  return <GenericValue type={type} {...props} />
}

const ArrayValue = ({ address }: { address: string }) => {
  const explorerUrl = useSelector((state: AppReduxState) => currentBlockExplorerInfo(state, address))
  return <EthHashInfo textSize="xl" hash={address} showCopyBtn explorerUrl={explorerUrl} />
}

export default Value
