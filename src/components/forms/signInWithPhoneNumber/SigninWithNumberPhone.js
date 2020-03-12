import React, { Component } from 'react';
import * as firebaseui from 'firebaseui'
import { Container, Avatar, Typography, TextField, Button, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@material-ui/core";
import LockOutLineIcon from "@material-ui/icons/LockOutlined";
import style from './signinWithNumberPhoneStyles'

import { consumerFirebase } from '../../../server';
import { SessionStateContext } from '../../../session/sessionStore'
import { displaySnackBar } from '../../../session/actions/snackBarAction';

class SigninWithNumberPhone extends Component {
  static contextType = SessionStateContext

  state = {
    disable : true,
    isAlertOpen: false,
    confirmationCode: null,
    userData : {
      userPhoneNumber: "",
      userCode: ""
    }
  }

  componentDidMount() {
    const { firebase } = this.props

    firebase.auth.languageCode = "es"
    window.recaptchaVerifier = new firebase.authorization.RecaptchaVerifier(
      this.recaptcha,
      {
        size: "normal",
        callback: response => {
          this.setState({
            disable: false
          })
        },
        "expired-callback" : function(){
          this.setState({
            disable: true
          })
          window.location.reload()
        }
      }
    )

    window.recaptchaVerifier.render().then(function(widgetID) {
      window.recaptchaVerifierId = widgetID
    })
  }

  onHandleChange = e => {
    this.setState({
      userData : {
        ...this.state.userData,
        [e.target.name] : e.target.value
      }
    })
  }

  checkUserPhone = e => {
    e.preventDefault()
    const { firebase } = this.props
    const { userPhoneNumber } = this.state.userData
    const captchaVerified = window.recaptchaVerifier

    firebase.auth
    .signInWithPhoneNumber(userPhoneNumber, captchaVerified)
    .then(sendedCode => {
      this.setState({
        confirmationCode : sendedCode,
        isAlertOpen : true
      })
    })
  }

  loginWithPhoneNumber = () => {
    const { firebase, history } = this.props
    const [{session}, dispatch] = this.context
    const { confirmationCode } = this.state
    const { userCode } = this.state.userData

    const credential = firebase.authorization.PhoneAuthProvider.
    credential(confirmationCode.verificationId, userCode)

    firebase.auth
    .signInAndRetrieveDataWithCredential(credential)
    .then(authUser => {
      firebase.db
      .collection("Users")
      .doc(authUser.user.uid)
      .set({
        id : authUser.user.uid,
        phoneNumber: authUser.user.phoneNumber
      }, {merge: true})
      .then(success => {
        firebase.db
        .collection("Users")
        .doc(authUser.user.uid)
        .get()
        .then(doc => {
          dispatch({
            type: 'SIGNIN',
            session: doc.data(),
            isAuthenticated : true
          })
          displaySnackBar(dispatch, {
            isOpen: true,
            message: "Inicio de sesió éxitoso"
          })
          history.push('/')
        })
      })
    })
    .catch(error => {
      displaySnackBar(dispatch, {
        isOpen: true,
        message: `Ha ocurrido un error: ${error.message}`
      })
    })
  }

  render() {
    return (
      <Container maxWidth="xs">
        <Dialog open={this.state.isAlertOpen} onClose={() => {this.setState({isAlertOpen: false})}}>
          <DialogTitle>Ingrese su código</DialogTitle>
          <DialogContent>
            <DialogContentText>Ingrese el código que recibió por mensaje de texto</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              name="userCode"
              fullWidth
              value={this.state.userData.userCode}
              onChange={this.onHandleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={() => {this.setState({isAlertOpen: false})}}>Cancelar</Button>
            <Button color="primary" onClick={this.loginWithPhoneNumber}>Verificar</Button>
          </DialogActions>
        </Dialog>

        <div style={style.paper}>
          <Avatar style={style.avatar}>
            <LockOutLineIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Ingrese su número telefónico
          </Typography>

          <form style={style.form} onSubmit={this.checkUserPhone}>
            <TextField
              variant="outlined"
              name="userPhoneNumber"
              label="Ingrese su teléfono"
              fullWidth
              style={style.textField}
              value={this.state.userData.userPhoneNumber}
              onChange={this.onHandleChange}
            />
            <Grid container justify="center" style={style.captcha}>
              <div ref={ref => (this.recaptcha = ref)}></div>
            </Grid>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              fullWidth
              style={style.submit}
              disabled={this.state.disable}
            >
              Recibir código
            </Button>
          </form>
          
        </div>
      </Container>
    );
  }
}

export default consumerFirebase(SigninWithNumberPhone);