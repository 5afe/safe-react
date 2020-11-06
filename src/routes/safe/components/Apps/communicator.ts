import { MutableRefObject } from 'react'
import { Methods } from '@gnosis.pm/safe-apps-sdk'
import { SafeApp } from './types.d'

class AppCommunicator {
  private iframe: HTMLIFrameElement
  private handlers = new Map()
  private app: SafeApp

  constructor(iframeRef: MutableRefObject<HTMLIFrameElement>, app: SafeApp) {
    this.iframe = iframeRef.current
    this.app = app

    window.addEventListener('message', this.handleIncomingMessage)
  }

  on(method: Methods, handler: () => Promise<unknown> | unknown): void {
    this.handlers.set(method, handler)
  }

  isValidMessage(msg): boolean {
    const sameOrigin = msg.origin === window.origin
    const knownOrigin = this.app.url.includes(msg.origin)

    return knownOrigin && !sameOrigin
  }

  canHandleMessage(msg): boolean {
    return !!this.handlers.get(msg.data.method)
  }

  handleIncomingMessage(msg: MessageEvent) {
    const validMessage = this.isValidMessage(msg)
    const hasHandler = this.canHandleMessage(msg)
    if (validMessage && hasHandler) {
    }
  }

  clear() {
    window.removeEventListener('message', this.handleIncomingMessage)
  }
}

const useAppCommunicator = (iframeRef: MutableRefObject<HTMLIFrameElement>): AppCommunicator => {
  return new AppCommunicator(iframeRef)
}

export { useAppCommunicator }
