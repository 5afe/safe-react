import React from 'react'

import Divider from './index'

export default {
  title: 'Data Display/Divider',
  component: Divider,
  parameters: {
    componentSubtitle: 'Used to separate content.',
  },
}

export const Horizontal = (): React.ReactElement => (
  <>
    <div>Some content</div>
    <Divider />
    <div>Some content2</div>
  </>
)

export const Arrow = (): React.ReactElement => (
  <>
    <div>Some content</div>
    <Divider withArrow />
    <div>Some content2</div>
  </>
)
