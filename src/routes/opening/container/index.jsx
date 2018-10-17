// @flow
import { connect } from 'react-redux'
import selector from './selector'
import Layout from '../component'

export default connect(selector)(Layout)
