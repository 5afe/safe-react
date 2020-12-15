import { SafeRecordProps } from 'src/logic/safe/store/models/safe'

import isEqual from 'lodash.isequal'

export const shouldSafeStoreBeUpdated = (
  newSafeProps: Partial<SafeRecordProps>,
  oldSafeProps?: SafeRecordProps,
): boolean => {
  if (!oldSafeProps) return true

  return !isEqual(oldSafeProps, newSafeProps)
}
