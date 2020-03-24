import axios from 'axios'

export const getNotificationPermission = (firebase, user, dispatch) => {
  return new Promise(async (resolve, reject) => {
    const message = firebase.messaging
    await message.requestPermission()
    const token = await message.getToken()

    if(!user.tokenArray){
      user.tokenArray = []
    }

    const tokenFilterArray = user.tokenArray.filter(tk => tk !== token)
    tokenFilterArray.push(token)

    user.tokenArray = tokenFilterArray

    firebase.updateDocumentToFirestore('Users', firebase.auth.currentUser.uid, user)
    .then(success => {
      dispatch({
        type: 'SIGNIN',
        session: user,
        isAuthenticated : true
      })
      resolve(true)
    })
    .catch(error => {
      resolve(false)
    })
  })
}

export const sendNotification = token => {
  return new Promise(async (resolve, reject) => {
    const response = await axios.post(`${process.env.REACT_APP_SEND_NOTIFICATION_POINT}`, token)
    resolve(response)
  })
}