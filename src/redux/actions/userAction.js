import axios from 'axios'

export const getUsersList = (dispatch) => {
  return new Promise( async (resolve, reject) => {
    
    const dataResult  = await axios.get(`${process.env.REACT_APP_USER_LIST_ENDPOINT}/list`)

    dispatch({
      type: 'USER_LIST',
      payload: dataResult.data.users
    })
    resolve()
  })
}

export const updateUserRoles = (dispatch, user, role, firebase) => {
  return new Promise(async (resolve, reject) => {
    firebase.auth.onAuthStateChanged(user => {
      if(user){
        user.getIdToken()
        .then(async userToken =>{
          const headers = {
            "Content-Type": "Application/json",
            "authorization": "Bearer " + userToken
          }

          const params = {
            id: user.id,
            role: role,
            roles: user.roles
          }
          const dataResult = await axios.post(`${process.env.REACT_APP_USER_UPDATE_ROLES}`, params, {"headers": headers})
      
          resolve(dataResult)
        })
      }
    })
  }) 
}