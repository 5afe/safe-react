import { Text } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'

import {
  isAddress,
  isArrayParameter,
} from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/utils'
import { HexEncodedData } from './HexEncodedData'
import { getExplorerInfo } from 'src/config'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'

const NestedWrapper = styled.div`
  padding-left: 12px;
`

interface RenderValueProps {
  method: string
  type: string
  value: string | string[]
  key?: string
}

const GenericValue = ({ method, type, value }: RenderValueProps): React.ReactElement => {
  const getTextValue = (value: string, key?: string) => <HexEncodedData limit={60} hexData={value} key={key} />

  const getArrayValue = (parentId: string, value: string[] | string) => (
    <>
      [
      <NestedWrapper>
        {(value as string[]).map((currentValue, index) => {
          const key = `${parentId}-value-${index}`
          return Array.isArray(currentValue) ? (
            <Text key={key} size="xl" as="span">
              {index > 0 && (
                <>
                  ,<br />
                </>
              )}
              {getArrayValue(key, currentValue)}
            </Text>
          ) : (
            getTextValue(currentValue, key)
          )
        })}
      </NestedWrapper>
      ]
    </>
  )

  if (isArrayParameter(type) || Array.isArray(value)) {
    return getArrayValue(method, value)
  }

  return getTextValue(value as string)
}

const Value = ({ type, ...props }: RenderValueProps): React.ReactElement => {
  if (isArrayParameter(type) && isAddress(type)) {
    return (
      <>
        [
        <NestedWrapper>
          {(props.value as string[]).map((address, index) => {
            const key = `${props.key || props.method}-${index}`
            if (Array.isArray(address)) {
              const newProps = {
                type,
                ...props,
                value: address,
                key,
              }
              return <Value {...newProps} />
            }
            const explorerUrl = getExplorerInfo(address)
            return (
              <PrefixedEthHashInfo
                key={`${address}_${key}`}
                textSize="xl"
                hash={address}
                showCopyBtn
                explorerUrl={explorerUrl}
              />
            )
          })}
        </NestedWrapper>
        ]
      </>
    )
  }

  if (isAddress(type)) {
    const explorerUrl = getExplorerInfo(props.value as string)
    return (
      <PrefixedEthHashInfo
        textSize="xl"
        hash={props.value as string}
        showCopyBtn
        explorerUrl={explorerUrl}
        shortenHash={4}
      />
    )
  }

  return <GenericValue type={type} {...props} />
}

export default Value
