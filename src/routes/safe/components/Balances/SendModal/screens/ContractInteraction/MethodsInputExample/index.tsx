import React, { ReactElement } from 'react'
import { Text } from '@gnosis.pm/safe-react-components'

type Props = {
  showExamples: boolean
}

export const MethodsInputExamples = ({ showExamples }: Props): ReactElement => {
  return (
    <>
      {showExamples ? (
        <>
          <Text size="sm" strong>
            string {'> '}
            <Text size="sm" as="span">
              some value
            </Text>
          </Text>
          <Text size="sm" strong>
            uint256 {'> '}
            <Text size="sm" as="span">
              123
            </Text>
          </Text>
          <Text size="sm" strong>
            address {'> '}
            <Text size="sm" as="span">
              0xDe75665F3BE46D696e5579628fA17b662e6fC04e
            </Text>
          </Text>
          <Text size="sm" strong>
            array {'> '}
            <Text size="sm" as="span">
              [1,2,3]
            </Text>
          </Text>
          <Text size="sm" strong>
            Tuple(uint256, string) {'> '}
            <Text size="sm" as="span">
              [1, &quot;someValue&quot;]
            </Text>
          </Text>
          <Text size="sm" strong>
            Tuple(uint256, string)[] {'> '}
            <Text size="sm" as="span">
              [[1, &quot;someValue&quot;], [2, &quot;someOtherValue&quot;]]
            </Text>
          </Text>
        </>
      ) : null}
    </>
  )
}
