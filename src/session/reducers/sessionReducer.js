const sessionReducer = (state, action) => {
  switch (action.type) {
    case "SIGNIN":
      return {
        ...state,
        user: action.session,
        isAuthenticated: action.isAuthenticated
      }
    case "CHANGE_SESSION":
      return {
        ...state,
        user: action.newUser,
        isAuthenticated: action.isAuthenticated
      }
    case "SIGNOUT":
      return {
        ...state,
        user: action.newUser,
        isAuthenticated: action.isAuthenticated
      }
    default:
      return state;
  }
}

export default sessionReducer
