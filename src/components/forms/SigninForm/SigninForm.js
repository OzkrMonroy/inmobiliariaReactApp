import React, { Component } from 'react';
import { Container, Avatar, Typography } from '@material-ui/core'
import LockOutLineIcon from '@material-ui/icons/LockOutlined'

import style from './signinFormStyles'

class SigninForm extends Component {
  render() {
    return (
      <Container maxWidth="xs">
        <div style={style.paper}>
          <Avatar style={style.avatar}>
            <LockOutLineIcon/>
          </Avatar>
          <Typography component="h1" variant="h5">Iniciar Sesión</Typography>
        </div>
      </Container>
    );
  }
}

export default SigninForm;