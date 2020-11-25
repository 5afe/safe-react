import { MutableRefObject, useEffect, useState } from 'react'
import {
  getSDKVersion,
  SDKMessageEvent,
  MethodToResponse,
  Methods,
  ErrorResponse,
  MessageFormatter,
  METHODS,
} from '@gnosis.pm/safe-apps-sdk'
import { SafeApp } from './types.d'

type MessageHandler = (
  msg: SDKMessageEvent,
) => void | MethodToResponse[Methods] | ErrorResponse | Promise<MethodToResponse[Methods] | ErrorResponse | void>

class AppCommunicator {
  private iframe: HTMLIFrameElement
  private handlers = new Map<Methods, MessageHandler>()
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
    // @ts-expect-error .parent doesn't exist on some possible types
    const sentFromIframe = msg.source.parent === window.parent
    const knownOrigin = this.app.url.includes(msg.origin)
    const knownMethod = Object.values(METHODS).includes(msg.data.method)

    return knownOrigin && sentFromIframe && knownMethod
  }

  private canHandleMessage = (msg: SDKMessageEvent): boolean => {
    return Boolean(this.handlers.get(msg.data.method))
  }

  send = (data, requestId, error = false): void => {
    const sdkVersion = getSDKVersion()
    const msg = error
      ? MessageFormatter.makeErrorResponse(requestId, data, sdkVersion)
      : MessageFormatter.makeResponse(requestId, data, sdkVersion)

    this.iframe.contentWindow?.postMessage(msg, this.app.url)
  }

  handleIncomingMessage = async (msg: SDKMessageEvent): Promise<void> => {
    const validMessage = this.isValidMessage(msg)
    const hasHandler = this.canHandleMessage(msg)

    if (validMessage && hasHandler) {
      const handler = this.handlers.get(msg.data.method)
      try {
        // @ts-expect-error Handler existence is checked in this.canHandleMessage
        const response = await handler(msg)

        // If response is not returned, it means the response will be send somewhere else
        if (typeof response !== 'undefined') {
          this.send(response, msg.data.id)
        }
      } catch (err) {
        console.log({ err })
        this.send(err.message, msg.data.id, true)
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
