import axios from 'axios'

export const getUserList = (dispatch) => {
  return new Promise( async (resolve, reject) => {
    
    const dataResult  = await axios.get(`${process.env.REACT_APP_USER_LIST_ENDPOINT}/list`)

    dispatch({
      type: 'USER_LIST',
      payload: dataResult.data
    })
    resolve()
  })
}

export const updateUserRoles = (dispatch, user) => {
  return new Promise(async (resolve, reject) => {
    
    const dataResult = await axios.post(`${process.env.REACT_APP_USER_UPDATE_ROLES}`, user)

    dispatch({
      type: 'USER_MAINTENANCE',
      payload: dataResult.data
    })
    resolve()
  }) 
}