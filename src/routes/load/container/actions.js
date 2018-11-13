// @flow
import updateSafe from '~/routes/safe/store/actions/updateSafe'

export type UpdateSafe = typeof updateSafe

export type Actions = {
  updateSafe: typeof updateSafe,
}

export default {
  updateSafe,
}
