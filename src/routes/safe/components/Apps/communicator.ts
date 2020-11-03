import { MutableRefObject } from 'react'

class AppCommunicator {
  #iframe: HTMLIFrameElement

  constructor(iframeRef: MutableRefObject<HTMLIFrameElement>) {
    this.#iframe = iframeRef.current
  }
}

const useAppCommunicator = () => {
  return new AppCommunicator()
}

export { useAppCommunicator }
