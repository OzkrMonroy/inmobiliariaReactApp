import React, { Component } from "react";
import { Container, Avatar, Typography, TextField, Button } from "@material-ui/core";
import LockOutLineIcon from "@material-ui/icons/LockOutlined";

import { compose } from 'recompose'
import { consumerFirebase } from '../../../server'

import { signinAction } from '../../../session/actions/sessionAction'
import { displaySnackBar } from '../../../session/actions/snackBarAction'
import { SessionStateContext } from '../../../session/sessionStore'

import style from "./signinFormStyles";

const initialState = {
  userEmail :'',
  userPassword : ''
}

class SigninForm extends Component {

  static contextType = SessionStateContext

  state = {
    firebase: null,
    userData : initialState
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
      userData: {
        ...this.state.userData,
        [e.target.name] : e.target.value
      }
    })
  }

  handleOnSubmit = async e => {
    e.preventDefault()

    const [{session}, dispatch] = this.context
    const { firebase, userData } = this.state
    const { history } = this.props

    let result = await signinAction(dispatch, firebase, userData.userEmail, userData.userPassword)

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

    const { userEmail, userPassword } = this.state.userData

    return (
      <Container maxWidth="xs">
        <div style={style.paper}>
          <Avatar style={style.avatar}>
            <LockOutLineIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Iniciar Sesión
          </Typography>
          <form style={style.form} onSubmit={this.handleOnSubmit}>
            <TextField
              onChange={this.handleOnChange}
              variant="outlined"
              label="Email"
              name="userEmail"
              fullWidth
              margin="normal"
              value={userEmail}
            />
            <TextField
              onChange={this.handleOnChange}
              variant="outlined"
              label="Password"
              name="userPassword"
              type="password"
              fullWidth
              margin="normal"
              value={userPassword}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              margin="normal"
            >
              Enviar
            </Button>
          </form>
        </div>
      </Container>
    );
  }
}

export default compose(consumerFirebase)(SigninForm);
