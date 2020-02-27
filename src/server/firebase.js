import app from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyD2stxpjMUHTE8n-e7tHIjOlGi4w1ivzXg",
  authDomain: "gestionpropiedades-3bca6.firebaseapp.com",
  databaseURL: "https://gestionpropiedades-3bca6.firebaseio.com",
  projectId: "gestionpropiedades-3bca6",
  storageBucket: "gestionpropiedades-3bca6.appspot.com",
  messagingSenderId: "364779489391",
  appId: "1:364779489391:web:259d980651dffc9f2e659a",
  measurementId: "G-NVE582M3VL"
};

class Firebase {
  
  constructor(){
    app.initializeApp(firebaseConfig)
    this.db = app.firestore()
    this.auth = app.auth()
    this.storage = app.storage()

    this.storage.ref().constructor.prototype.saveDocuments = function(documents, userName) {
      let ref = this
      const path = `${userName}/housesPhotos`
      return Promise.all(documents.map(file => {
        return ref.child(path+'/'+file.name).put(file).then(snapshot => ref.child(path+'/'+file.name).getDownloadURL())
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

  saveHousePhotos = (file, userName) => {
    const path = `${userName}/housesPhotos/`

    return this.storage.ref().child(path).put(file)
  }

  getHomePhotoUrl = (fileName, userName) => {
    const path = `${userName}/housesPhotos/${fileName}`
    return this.storage.ref().child(path).getDownloadURL()
  }

  saveFilesInStorage = (documents, userName) => this.storage.ref().saveDocuments(documents, userName)
}

export default Firebase