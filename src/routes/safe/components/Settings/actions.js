// @flow
import addSafeOwner from '~/routes/safe/store/actions/addSafeOwner'
import editSafeOwner from '~/routes/safe/store/actions/editSafeOwner'
import removeSafeOwner from '~/routes/safe/store/actions/removeSafeOwner'
import replaceSafeOwner from '~/routes/safe/store/actions/replaceSafeOwner'

export type Actions = {
  addSafeOwner: Function,
  removeSafeOwner: Function,
  replaceSafeOwner: Function,
  editSafeOwner: Function,
}

export default {
  addSafeOwner,
  removeSafeOwner,
  replaceSafeOwner,
  editSafeOwner,
}
