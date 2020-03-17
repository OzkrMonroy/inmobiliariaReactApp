const initialState = {
  users: [],
  message: {}
}

export default function(state = initialState, action) {
  switch (action.type) {
    case 'USER_LIST':
      return {
        ...state,
        users: action.payload
      }
    case 'USER_MAINTENANCE':
      return {
        ...state,
        mesagge: action.payload
      }
  
    default:
      return state
  }
}