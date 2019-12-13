// @flow
import { loadFromStorage, saveToStorage } from '~/utils/storage'

export const RECURRING_USER_KEY = 'RECURRING_USER'

const verifyRecurringUser = async () => {
  const recurringUser = await loadFromStorage(RECURRING_USER_KEY)

  if (recurringUser === undefined) {
    await saveToStorage(RECURRING_USER_KEY, false)
  }

  if (recurringUser === false) {
    await saveToStorage(RECURRING_USER_KEY, true)
  }
}

export default verifyRecurringUser
