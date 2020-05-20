import { connect } from 'react-redux'

import selector from './selector'

import Opening from './index'

export default connect(selector)(Opening)
