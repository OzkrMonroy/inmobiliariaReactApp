export const displaySnackBar = (dispatch, data) => {
  dispatch(({
    type: 'OPEN_SNACKBAR',
    isOpen: data.isOpen,
    message: data.message
  }))
}