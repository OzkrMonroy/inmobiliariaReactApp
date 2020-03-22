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

export const updateUserRoles = (dispatch, user, role) => {
  return new Promise(async (resolve, reject) => {
    const params = {
      id: user.id,
      role: role,
      roles: user.roles
    }
    const dataResult = await axios.post(`${process.env.REACT_APP_USER_UPDATE_ROLES}`, params)

    dispatch({
      type: 'USER_MAINTENANCE',
      payload: dataResult.data
    })
    resolve()
  }) 
}