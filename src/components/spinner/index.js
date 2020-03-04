import React from 'react'
import { useStyles } from './spinnerStyles'
import { CircularProgress } from '@material-ui/core'
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "../../theme/theme";

export const MainSpinner = () => {
  const classes = useStyles()

  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.root}>
        <CircularProgress color="primary" className={classes.progress} size={50}/>
      </div>
    </MuiThemeProvider>
  );
}

export const SecondarySpinner = props => {
  const classes = useStyles()
  
  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.container}>
        <CircularProgress color={props.color} className={classes.progress} size={props.size}/>
      </div>
    </MuiThemeProvider>
  )
}
