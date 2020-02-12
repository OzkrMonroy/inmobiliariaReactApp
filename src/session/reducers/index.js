import sessionReducer from './sessionReducer'
import openSnackBarReducer from  './openSnackBarReducer'

export const mainReducer = ({session, openSnackBar}, action) => {
  return {
    session: sessionReducer(session, action),
    openSnackBar : openSnackBarReducer(openSnackBar, action)
  }
}