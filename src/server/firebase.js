import app from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

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