import React, { Component } from 'react';
import { Container, Avatar, Typography, Grid, TextField, Button } from '@material-ui/core';
import LockOutLineIcon from '@material-ui/icons/LockOutlined'
import { compose } from 'recompose'

import { style } from './signupFormStyle'
import { consumerFirebase } from '../../../server'

const initialState = {
  userName: '',
  userLastName: '',
  userEmail: '',
  userPassword: ''
}

class SignupForm extends Component {

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

  handleOnSubmit = e => {
    e.preventDefault()

    const { user, firebase } = this.state

    firebase.db
    .collection('Users')
    .add(user)
    .then(userAdd => {
      console.log('Usuario añadido con éxito', userAdd)
      this.setState({
        user : initialState
      })
    })
    .catch(error => console.log('error:', error))
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