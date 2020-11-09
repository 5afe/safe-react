import { MutableRefObject, useEffect, useState } from 'react'
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

  on = (method: Methods, handler: () => Promise<unknown> | unknown): void => {
    this.handlers.set(method, handler)
  }

  private isValidMessage = (msg): boolean => {
    const sameOrigin = msg.origin === window.origin
    const knownOrigin = this.app.url.includes(msg.origin)

    return knownOrigin && !sameOrigin
  }

  private canHandleMessage = (msg): boolean => {
    return !!this.handlers.get(msg.data.method)
  }

  send = (response, requestId): void => {
    this.iframe.contentWindow?.postMessage({ response, requestId }, this.app.url)
  }

  handleIncomingMessage = (msg: MessageEvent): void => {
    const validMessage = this.isValidMessage(msg)
    const hasHandler = this.canHandleMessage(msg)

    if (validMessage && hasHandler) {
      const handler = this.handlers.get(msg.data.method)
      const response = handler(msg)

      if (response) {
        this.send(response, msg.data.requestId)
      }
    }
  }

  clear = (): void => {
    window.removeEventListener('message', this.handleIncomingMessage)
  }
}

const useAppCommunicator = (
  iframeRef: MutableRefObject<HTMLIFrameElement | null>,
  app?: SafeApp,
): AppCommunicator | undefined => {
  const [communicator, setCommunicator] = useState<AppCommunicator | undefined>(undefined)

  useEffect(() => {
    let communicatorInstance
    const initCommunicator = (iframeRef: MutableRefObject<HTMLIFrameElement>, app: SafeApp) => {
      communicatorInstance = new AppCommunicator(iframeRef, app)
      setCommunicator(communicatorInstance)
    }

    if (app && iframeRef.current !== null) {
      initCommunicator(iframeRef as MutableRefObject<HTMLIFrameElement>, app)
    }

    return () => {
      communicatorInstance?.clear()
    }
  }, [app, iframeRef])

  return communicator
}

export { useAppCommunicator }
