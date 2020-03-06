import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => ({
  root : {
    width: '100%',
    height: '100vh',
    position: 'relative'
  },
  container : {
    width: '100%',
    position: 'relative'
  },
  progress : {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    margin: 'auto'
  }
}))