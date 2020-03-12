import React, { Component } from 'react';
import * as firebaseui from 'firebaseui'
import { Container, Avatar, Typography, TextField, Button, Grid } from "@material-ui/core";
import LockOutLineIcon from "@material-ui/icons/LockOutlined";
import style from './signinWithNumberPhoneStyles'
import { consumerFirebase } from '../../../server';

class SigninWithNumberPhone extends Component {

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
        }
      }
    )

    window.recaptchaVerifier.render().then(function(widgetID) {
      window.recaptchaVerifierId = widgetID
    })
  }

  render() {
    return (
      <Container maxWidth="xs">
        <div style={style.paper}>
          <Avatar style={style.avatar}>
            <LockOutLineIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Ingrese su número telefónico
          </Typography>

          <form style={style.form} onSubmit={this.handleOnSubmit}>
            <TextField
              variant="outlined"
              name="userPhoneNumber"
              label="Ingrese su teléfono"
              fullWidth
              style={style.textField}
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