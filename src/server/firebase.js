import app from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/messaging'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATA_BASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

class Firebase {
  
  constructor(){
    app.initializeApp(firebaseConfig)
    this.db = app.firestore()
    this.auth = app.auth()
    this.storage = app.storage()
    this.authorization = app.auth

    this.messaginValidation = app.messaging
    if(this.messaginValidation.isSupported()) {
      this.messaging = app.messaging()
      this.messaging.usePublicVapidKey("BB5UluSzncwIJcSPYHFtD8IaRJlrPxo7yVldt-EvcD6RuHiwyj5UkA7WeftYjhu-8ZAVXTn4QDW4FgF3dfk3y0k")
    }

    this.storage.ref().constructor.prototype.saveDocuments = function(documents, userName, houseName) {
      let ref = this
      const path = `${userName}/housesPhotos/${houseName}`
      return Promise.all(documents.map(file => {
        return ref.child(path+'/'+file.alias).put(file).then(snapshot => ref.child(path+'/'+file.alias).getDownloadURL())
      }))
    }
  }

  isReady() {
    return new Promise(resolve => {
      this.auth.onAuthStateChanged(resolve)
    })
  }

  addDocumentToFirestore = (collectionName, data) => {
    return this.db.collection(collectionName).add(data)
  }

  updateDocumentToFirestore = (collectionName, documentId, data) => {
    return this.db.collection(collectionName).doc(documentId).set(data, {merge:true})
  }

  getDocumentFromFirestore = (collectionName, documentId) => {
    return this.db.collection(collectionName).doc(documentId).get()
  }

  deleteDocumentFromFirestore = (collectionName, documentId) => {
    return this.db.collection(collectionName).doc(documentId).delete()
  }

  saveFileInStorage = (fileName, file, userName) => {
    const path = `${userName}/profilePhoto/${fileName}`

    return this.storage.ref().child(path).put(file)
  }

  getFileUrl = (fileName, userName) => {
    const path = `${userName}/profilePhoto/${fileName}`
    return this.storage.ref().child(path).getDownloadURL()
  }

  saveFilesInStorage = (documents, userName, houseName) => this.storage.ref().saveDocuments(documents, userName, houseName)

  deleteFileInStorage = (fileName, userName,  houseName) => {
    const path = `${userName}/housesPhotos/${houseName}`

    return this.storage.ref().child(path+'/'+fileName).delete()
  }
}

export default Firebase