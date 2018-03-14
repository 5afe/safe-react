// @flow
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Block from '~/components/layout/Block'
import AppRoutes from './routes'
import styles from './App.scss'

const ReactRouterApp = () => (
  <BrowserRouter>
    <Block className={styles.container}>
      <AppRoutes />
    </Block>
  </BrowserRouter>
)

export default ReactRouterApp
