// import { initialState } from '../initState'

export const signinAction = (dispatch, firebase, email, password) => {

  return new Promise((resolve, reject) => {
    
    firebase.auth
    .signInWithEmailAndPassword(email, password)
    .then(auth => {
      
      firebase.db
      .collection('Users')
      .doc(auth.user.uid)
      .get()
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
      firebase.db
      .collection('Users')
      .doc(auth.user.uid)
      .set({
        id : auth.user.uid,
        email: user.userEmail,
        name: user.userName,
        lastName: user.userLastName
      }, {merge: true})
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

//TODO: Optimizar esta parte
export const SignOutAction = (dispatch, firebase) => {
  return new Promise((resolve, reject) => {

    firebase.auth
    .signOut()
    .then(result => {
      dispatch({
        type: 'SIGNOUT',
        newUser: {
          name: '',
          lastName: '',
          email: '',
          photo: '',
          id: '',
          phoneNumber: ''
        },
        isAuthenticated: false
      })
      resolve()
    })

  })
}