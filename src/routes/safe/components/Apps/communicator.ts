import { MutableRefObject, useEffect, useState } from 'react'
import { __VERSION__, SDKMessageEvent, MethodToResponse, Methods, ErrorResponse } from '@gnosis.pm/safe-apps-sdk'
import { SafeApp } from './types.d'

type MessageHandler = (
  msg: SDKMessageEvent,
) => void | MethodToResponse[Methods] | ErrorResponse | Promise<MethodToResponse[Methods] | ErrorResponse | void>

class AppCommunicator {
  private iframe: HTMLIFrameElement
  private handlers = new Map<string, MessageHandler>()
  private app: SafeApp

  constructor(iframeRef: MutableRefObject<HTMLIFrameElement>, app: SafeApp) {
    this.iframe = iframeRef.current
    this.app = app

    window.addEventListener('message', this.handleIncomingMessage)
  }

  on = (method: Methods, handler: MessageHandler): void => {
    this.handlers.set(method, handler)
  }

  private isValidMessage = (msg: SDKMessageEvent): boolean => {
    const sameOrigin = msg.origin === window.origin
    const knownOrigin = this.app.url.includes(msg.origin)

    return knownOrigin && !sameOrigin
  }

  private canHandleMessage = (msg: SDKMessageEvent): boolean => {
    return Boolean(this.handlers.get(msg.data.method))
  }

  send = (response, requestId): void => {
    console.log({ response, requestId })
    this.iframe.contentWindow?.postMessage({ response, requestId, version: __VERSION__ }, this.app.url)
  }

  handleIncomingMessage = async (msg: SDKMessageEvent): Promise<void> => {
    const validMessage = this.isValidMessage(msg)
    const hasHandler = this.canHandleMessage(msg)

    if (validMessage && hasHandler) {
      const handler = this.handlers.get(msg.data.method)
      // @ts-expect-error Handler existence is checked in this.canHandleMessage
      const response = await handler(msg)

      // If response is not returned, it means the response will be send somewhere else
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
