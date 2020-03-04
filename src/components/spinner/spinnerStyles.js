import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(theme => ({
  root : {
    width: '100%',
    height: '100vh',
    position: 'relative'
  },
  container : {
    width: '100%',
    height: '100%',
    position: 'relative'
  },
  progress : {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  }
}))