import React, { Component } from 'react';
import { Container, Paper, Grid, Breadcrumbs, Typography, TextField, Button } from '@material-ui/core';
import { Link } from 'react-router-dom'
import HomeIcon from '@material-ui/icons/Home'

import { style } from './newHomeStyle'
import { displaySnackBar } from '../../../session/actions/snackBarAction'

import { consumerFirebase } from '../../../server'
import { SessionStateContext } from '../../../session/sessionStore'

const initialState = {
  address: '',
  city: '',
  country: '',
  description: '',
  insideDescription: ''
}

class NewHome extends Component {

  static contextType = SessionStateContext

  state = {
    newHomeData : initialState
  }

  handleOnChange = e => {
    this.setState({
      newHomeData : {
        ...this.state.newHomeData,
        [e.target.name] : e.target.value
      }
    })
  }

  handleOnClick = () => {
    const { newHomeData } = this.state
    const { firebase, history } = this.props
    const [{session}, dispatch] = this.context

    firebase.db
    .collection('Homes')
    .add(newHomeData)
    .then(success => {
      history.push('/')
      displaySnackBar(dispatch, {
        isOpen : true,
        message: 'Se agregó el inmueble correctamente'
      })
    })
    .catch(error => {
      displaySnackBar(dispatch, {
        isOpen : true,
        message: `Ocurrió un error: ${error}`
      })
    })
  }

  render() {
    return (
      <Container style={style.container}>
        <Paper style={style.paper}>

          <Grid container spacing={3}>

            <Grid item xs={12} md={8}>
              <Breadcrumbs aria-label="breadcrumb">
                <Link style={style.link} to="/" color="inherit">
                  <HomeIcon style={style.homeIcon}/>
                  Home
                </Link>
                <Typography color="textPrimary">Nuevo Inmueble</Typography>
              </Breadcrumbs>
            </Grid>

            <Grid item xs={12} md={12}>
              <TextField
                name="address"
                label="Dirección"
                fullWidth
                onChange={this.handleOnChange}
                value={this.state.newHomeData.address}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="city"
                label="Ciudad"
                fullWidth
                onChange={this.handleOnChange}
                value={this.state.newHomeData.city}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="country"
                label="País"
                fullWidth
                onChange={this.handleOnChange}
                value={this.state.newHomeData.country}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                name="description"
                label="Descripción del Inmueble"
                fullWidth
                onChange={this.handleOnChange}
                value={this.state.newHomeData.description}
                multiline
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                name="insideDescription"
                label="Descripción del interior del Inmueble"
                fullWidth
                onChange={this.handleOnChange}
                value={this.state.newHomeData.insideDescription}
                multiline
              />
            </Grid>
          </Grid>

          <Grid container justify="center">
            <Grid item xs={12} md={6}>
              <Button
                type="button"
                variant="contained"
                size="large"
                color="primary"
                fullWidth
                style={style.button}
                onClick={this.handleOnClick}
              >
                Guardar
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }
}

export default consumerFirebase(NewHome);