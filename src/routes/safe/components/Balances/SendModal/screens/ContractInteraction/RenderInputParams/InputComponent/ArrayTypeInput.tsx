import { TextAreaField } from 'src/components/forms/TextAreaField'
import {
  isAddress,
  isBoolean,
  isByte,
  isInt,
  isUint,
} from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/utils'

const validator = (value: string): string | undefined => {
  try {
    const values = JSON.parse(value)

    if (!Array.isArray(values)) {
      return 'be sure to surround value with []'
    }
  } catch (e) {
    return 'invalid format'
  }
}

const typePlaceholder = (text: string, type: string): string => {
  if (isAddress(type)) {
    return `${text} E.g.: ["0xACa94ef8bD5ffEE41947b4585a84BdA5a3d3DA6E","0x1dF62f291b2E969fB0849d99D9Ce41e2F137006e"]`
  }

  if (isBoolean(type)) {
    return `${text} E.g.: [true, false, false, true]`
  }

  if (isUint(type)) {
    return `${text} E.g.: [1000, 212, 320000022, 23]`
  }

  if (isInt(type)) {
    return `${text} E.g.: [1000, -212, 1232, -1]`
  }

  if (isByte(type)) {
    return `${text} E.g.: ["0xc00000000000000000000000000000000000", "0xc00000000000000000000000000000000001"]`
  }

  return `${text} E.g.: ["first value", "second value", "third value"]`
}

const ArrayTypeInput = ({ name, text, type }: { name: string; text: string; type: string }): React.ReactElement => (
  <TextAreaField name={name} placeholder={typePlaceholder(text, type)} label={text} type="text" validate={validator} />
)

export default ArrayTypeInput
