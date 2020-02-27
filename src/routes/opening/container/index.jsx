// @flow
import { connect } from 'react-redux'

import Layout from '../component'

import selector from './selector'

export default connect(selector)(Layout)
