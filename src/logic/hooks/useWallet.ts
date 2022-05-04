// import React from "react"
import { atom, useRecoilState } from 'recoil'

import { auth, functions } from '../../modules/firebase'
import { initializeWeb3Modal, getWeb3, getEthersSigner, clearWeb3Modal } from '../../modules/web3'
// import { LoadingOverlay } from "../molecules/LoadingOverlay";
// import { MessageModalProps } from "../molecules/MessageModal";
// import { MessageModal } from "../molecules/MessageModal";
// import { NotificationToastProps } from "../molecules/NotificationToast";
// import { NotificationToast } from "../molecules/NotificationToast";

// export interface AtomsRootProps {
//   children: React.ReactNode;
// }

// export const loadingOverlayDisplayAtom = atom({
//   key: "loadingOverlayDisplay",
//   default: false,
// });
// export const messageModalDisplayAtom = atom({
//   key: "messageModalDisplay",
//   default: false,
// });
// export const notificationToastDisplayAtom = atom({
//   key: "notificationToastDisplay",
//   default: true,
// });
// export const messageModalPropsAtom = atom<MessageModalProps | undefined>({
//   key: "messageModalProps",
//   default: undefined,
// });

// export const notificationToastPropsAtom = atom<NotificationToastProps | undefined>({
//   key: "notificationToastProps",
//   default: undefined,
// });

export const signerAddressAtom = atom({
  key: 'signerAddress',
  default: '',
})

// export const useLoadingOverlay = () => {
//   const [isLoadingOverlayDiplay, setLoadingOverlayDisplay] = useRecoilState(loadingOverlayDisplayAtom);
//   const openLoadingOverlay = () => {
//     setLoadingOverlayDisplay(true);
//   };
//   const closeLoadingOverlay = () => {
//     setLoadingOverlayDisplay(false);
//   };
//   return { isLoadingOverlayDiplay, openLoadingOverlay, closeLoadingOverlay };
// };

// export const useMessageModal = () => {
//   const [isMessageModalDisplay, setMessageModalDisplay] = useRecoilState(messageModalDisplayAtom);
//   const [messageModalProps, setMessageModalProps] = useRecoilState(messageModalPropsAtom);
//   const openMessageModal = (props: MessageModalProps) => {
//     setMessageModalProps(props);
//     setMessageModalDisplay(true);
//   };
//   const closeMessageModal = () => {
//     setMessageModalDisplay(false);
//     setMessageModalProps(undefined);
//   };
//   return { isMessageModalDisplay, messageModalProps, openMessageModal, closeMessageModal };
// };

// export const useNotificationToast = () => {
//   const [isNotificationToastDisplay, setNotificationToastDisplay] = useRecoilState(notificationToastDisplayAtom);
//   const [notificationToastProps, setNotificationToastProps] = useRecoilState(notificationToastPropsAtom);
//   const openNotificationToast = (props: NotificationToastProps) => {
//     setNotificationToastProps(props);
//     setNotificationToastDisplay(true);
//     console.log("set");
//   };
//   const closeNotificationToast = () => {
//     setNotificationToastDisplay(false);
//     setNotificationToastProps(undefined);
//   };

//   return { isNotificationToastDisplay, notificationToastProps, openNotificationToast, closeNotificationToast };
// };

export const useWallet = () => {
  const [userAddress, setSignerAddressState] = useRecoilState(signerAddressAtom)

  const connectWallet = async () => {
    const provider = await initializeWeb3Modal()

    const web3 = await getWeb3(provider)
    const signer = await getEthersSigner(provider)
    const signerAddress = (await signer.getAddress()).toLowerCase()
    if (userAddress != signerAddress) {
      const message = `Welcome to Collab0rca Factory!`
      const signature = await web3.eth.personal.sign(`${message}${signerAddress}`, signerAddress, '')
      const response = await functions.httpsCallable('connectWallet')({
        signature,
        signerAddress,
      })
      auth.signInWithCustomToken(response.data)
      setSignerAddressState(signerAddress)
    }

    // analytics.logEvent('click', {
    //   type: 'button',
    //   name: 'connect_wallet',
    // })

    return { web3, signer, signerAddress }
  }

  const disconnectWallet = () => {
    clearWeb3Modal()
    setSignerAddressState('')

    // analytics.logEvent('click', {
    //   type: 'button',
    //   name: 'disconnect_wallet',
    // })
  }
  return { userAddress, connectWallet, disconnectWallet }
}

// export const AtomsRootLoader: React.FC<AtomsRootProps> = ({ children }) => {
//   const { isLoadingOverlayDiplay } = useLoadingOverlay();
//   const { isMessageModalDisplay, messageModalProps } = useMessageModal();
//   const { isNotificationToastDisplay, notificationToastProps, closeNotificationToast } = useNotificationToast();
//   return (
//     <>
//       {children}
//       {isLoadingOverlayDiplay && <LoadingOverlay />}
//       {isMessageModalDisplay && messageModalProps && <MessageModal {...messageModalProps} />}
//       {isNotificationToastDisplay && notificationToastProps && (
//         <NotificationToast {...notificationToastProps} onClickDismiss={closeNotificationToast} />
//       )}
//     </>
//   );
// };

// export const openWindow = (link: string) => {
//   window.open(link);
// };
