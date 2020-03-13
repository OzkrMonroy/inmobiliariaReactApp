import { initialUserState } from '../../utils'

export const signinAction = (dispatch, firebase, email, password) => {

  return new Promise((resolve, reject) => {
    
    firebase.auth
    .signInWithEmailAndPassword(email, password)
    .then(auth => {
      
      firebase.getDocumentFromFirestore('Users', auth.user.uid)
      .then(doc => {
        const usuarioDB = doc.data()

        dispatch({
          type: 'SIGNIN',
          session: usuarioDB,
          isAuthenticated : true
        })

        resolve({status: true})
      })
    })
    .catch(error => {
      console.log('error', error)
      resolve({status: false, message: error})
    })
  })

}

export const createUserAction = (dispatch, firebase, user) => {

  return new Promise((resolve, reject) => {

    firebase.auth
    .createUserWithEmailAndPassword(user.userEmail, user.userPassword)
    .then(auth => {
      const userData = {
        id : auth.user.uid,
        email: user.userEmail,
        name: user.userName,
        lastName: user.userLastName
      }

      firebase.updateDocumentToFirestore('Users', auth.user.uid, userData)
      .then(doc => {
        user.id = auth.user.uid
        
        dispatch({
          type: 'SIGNIN',
          session: user,
          isAuthenticated : true
        })

        resolve({status: true})
      })
      .catch(error => {
        console.log(error)
        resolve({status: false, message: error})
      })
    })
    .catch(error => {
      console.log(error)
      resolve({status: false, message: error})
    })
  })
}

export const SignOutAction = (dispatch, firebase) => {
  return new Promise((resolve, reject) => {

    firebase.auth
    .signOut()
    .then(result => {
      dispatch({
        type: 'SIGNOUT',
        newUser: initialUserState,
        isAuthenticated: false
      })
      resolve()
    })

  })
}