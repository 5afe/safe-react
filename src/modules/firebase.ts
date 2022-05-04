import firebase from 'firebase/app'
import 'firebase/functions'
import 'firebase/auth'
import 'firebase/firestore'

import firebaseJson from 'src/utils/firebase.json'

const firebaseConfig = {
  production: {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
  },
  development: {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
  },
}

const nodeEnv = process.env.NODE_ENV

!firebase.apps.length
  ? firebase.initializeApp(firebaseConfig[nodeEnv === 'production' ? 'production' : 'development'])
  : firebase.app()
const auth = firebase.auth()
const firestore = firebase.firestore()
const functions = firebase.functions()

if (nodeEnv === 'development') {
  firestore.settings({
    host: `localhost:${firebaseJson.emulators.firestore.port}`,
    ssl: false,
  })
  functions.useEmulator('localhost', firebaseJson.emulators.functions.port)
  auth.useEmulator(`http://localhost:${firebaseJson.emulators.auth.port}`)
}

export const DB_VIRSION = process.env.REACT_APP_DB_VIRSION ? process.env.REACT_APP_DB_VIRSION : 'v0'

export { auth, firestore, functions }
