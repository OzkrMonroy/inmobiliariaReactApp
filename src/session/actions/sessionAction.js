import { initialState } from '../initState'

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

        resolve()
      })
    })
    .catch(error => console.log('error', error))
  })

}

export const createUser = (dispatch, firebase, user) => {

  return new Promise((resolve, reject) => {

    firebase.auth
    .createUserWithEmailAndPassword(user.userEmal, user.userPassword)
    .then(auth => {
      firebase.db
      .collection('Users')
      .doc(auth.user.uid)
      .set({
        id : auth.user.uid,
        email: auth.user.userEmail,
        name: auth.user.userName,
        lasName: auth.user.userLastName
      }, {merge: true})
      .then(doc => {
        user.id = auth.user.uid
        
        dispatch({
          type: 'SIGNIN',
          session: user,
          isAuthenticated : true
        })

        resolve()
      })
    })
    .catch(error => console.log(error))
  })
}

//TODO: Optimizar esta parte
export const SignOut = (dispatch, firebase) => {
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