import React, { Component } from 'react';
import { Container, Avatar, Typography, Grid, TextField, Button } from '@material-ui/core';
import LockOutLineIcon from '@material-ui/icons/LockOutlined'
import { compose } from 'recompose'

import { style } from './signupFormStyle'
import { consumerFirebase } from '../../../server'

import { createUserAction } from '../../../session/actions/sessionAction'
import { displaySnackBar } from '../../../session/actions/snackBarAction'
import { SessionStateContext } from '../../../session/sessionStore'

const initialState = {
  userName: '',
  userLastName: '',
  userEmail: '',
  userPassword: ''
}

class SignupForm extends Component {

  static contextType = SessionStateContext

  state = {
    firebase: null,
    user: initialState
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    
    if(nextProps.firebase === prevState.firebase){
      return null
    }

    return {
      firebase: nextProps.firebase
    }
  }

  handleOnChange = e => {
    this.setState({
      user : {
        ...this.state.user,
        [e.target.name] : e.target.value
      }
    })
  }

  handleOnSubmit = async e => {
    e.preventDefault()

    const [{session}, dispatch] = this.context
    const { user, firebase } = this.state
    const { history } = this.props

    let result = await createUserAction(dispatch, firebase, user)

    if(result.status) {
      history.push('/')
    }else {
      displaySnackBar(dispatch, {
        isOpen: true,
        message: result.message.message
      })
    }

  }

  render() {

    const { userName, userLastName, userEmail, userPassword } = this.state.user

    return (
      <Container maxWidth="md">
        <div style={style.paper}>
          <Avatar style={style.avatar}>
            <LockOutLineIcon/>
          </Avatar>
          <Typography component="h1" variant="h5">Regístrate</Typography>
          <form style={style.form} onSubmit={this.handleOnSubmit}>
            <Grid container spacing={2}>
              <Grid item md={6} xs={12}>
                <TextField name="userName" onChange={this.handleOnChange} fullWidth label="Ingrese su nombre"value={userName}/>
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField name="userLastName" onChange={this.handleOnChange} fullWidth label="Ingrese su apellido" value={userLastName}/>
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField name="userEmail" onChange={this.handleOnChange} fullWidth label="Ingrese su correo electrónico" value={userEmail}/>
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField type="password" onChange={this.handleOnChange} name="userPassword" fullWidth label="Ingrese su contraseña" value={userPassword}/>
              </Grid>
            </Grid>
            
            <Grid container justify="center">
              <Grid item xs={12} md={6}>
                <Button type="submit" variant="contained" fullWidth size="large" color="primary" style={style.submit}>
                  Registrar
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    );
  }
}

export default compose(consumerFirebase)(SignupForm);