// import { SafeApp } from 'src/routes/safe/components/Apps/types'
// import { useEffect } from 'react'

// const operations = {
//   ON_SAFE_INFO: 'ON_SAFE_INFO',
//   SAFE_APP_SDK_INITIALIZED: 'SAFE_APP_SDK_INITIALIZED',
//   SEND_TRANSACTIONS: 'SEND_TRANSACTIONS',
// } as const
export const x = 5
// type Message = {}

// const useIframeMessageHandler = (selectedApp: SafeApp | undefined): void => {
//   // useEffect(() => {
//   //   const handleIframeMessage = (data) => {
//   //     if (!data || !data.messageId) {
//   //       console.error('ThirdPartyApp: A message was received without message id.')
//   //       return
//   //     }
//   //     switch (data.messageId) {
//   //       case operations.SEND_TRANSACTIONS: {
//   //         const onConfirm = async () => {
//   //           closeModal()
//   //           await sendTransactions(dispatch, safeAddress, data.data, enqueueSnackbar, closeSnackbar, selectedApp.id)
//   //         }
//   //         confirmTransactions(
//   //           safeAddress,
//   //           safeName,
//   //           ethBalance,
//   //           selectedApp.name,
//   //           selectedApp.iconUrl,
//   //           data.data,
//   //           openModal,
//   //           closeModal,
//   //           onConfirm,
//   //         )
//   //         break
//   //       }
//   //       default: {
//   //         console.error(`ThirdPartyApp: A message was received with an unknown message id ${data.messageId}.`)
//   //         break
//   //       }
//   //     }
//   //   }
//   //   const onIframeMessage = async ({ data, origin }) => {
//   //     if (origin === window.origin) {
//   //       return
//   //     }
//   //     if (!selectedApp.url.includes(origin)) {
//   //       console.error(`ThirdPartyApp: A message was received from an unknown origin ${origin}`)
//   //       return
//   //     }
//   //     handleIframeMessage(data)
//   //   }
//   //   window.addEventListener('message', onIframeMessage)
//   //   return () => {
//   //     window.removeEventListener('message', onIframeMessage)
//   //   }
//   // }, [selectedApp.iconUrl, selectedApp.id, selectedApp.name, selectedApp.url])
// }

// export { useIframeMessageHandler }
