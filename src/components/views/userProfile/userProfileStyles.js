import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  form : {
    width: "100%",
    marginTop: 20
  },
  submit: {
    marginTop: 15,
    marginBottom: 20
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10)
  },
}))

export const style = {
  height : {
    height: '50vh'
  }
}