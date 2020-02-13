import React from 'react'
import { Snackbar } from "@material-ui/core";

const SnackBar = ({ openSnackBar, dispatch }) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={openSnackBar ? openSnackBar.open : false}
      autoHideDuration={3000}
      ContentProps={{ "aria-describedby": "message-id" }}
      message={
        <span id="message-id">{openSnackBar ? openSnackBar.message : ""}</span>
      }
      onClose={() => {
        dispatch({
          type: "OPEN_SNACKBAR",
          open: false,
          message: ""
        });
      }}
    ></Snackbar>
  );
};

export default SnackBar;
