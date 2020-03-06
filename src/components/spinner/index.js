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

export const SecondarySpinner = ({color, size, containerHeight}) => {
  const classes = useStyles()
  
  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.container} style={containerHeight} >
        <CircularProgress color={color} className={classes.progress} size={size}/>
      </div>
    </MuiThemeProvider>
  )
}
