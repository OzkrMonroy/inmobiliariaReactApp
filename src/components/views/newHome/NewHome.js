import React, { Component } from 'react';
import { Container, Paper, Grid, Breadcrumbs, Typography, TextField, Button, Table, TableBody, TableRow, TableCell } from '@material-ui/core';
import { Link } from 'react-router-dom'
import HomeIcon from '@material-ui/icons/Home'
import ImageUploader from 'react-images-upload'

import { style } from './newHomeStyle'
import { displaySnackBar } from '../../../session/actions/snackBarAction'

import { consumerFirebase } from '../../../server'
import { SessionStateContext } from '../../../session/sessionStore'
import uuid from 'uuid';

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
    newHomeData : initialState,
    photosTemp: []
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

  savePhotosTemp = photosTemp => {
    Object.keys(photosTemp).forEach(key => {
      photosTemp[key].urlTemp = URL.createObjectURL(photosTemp[key])
    })

    this.setState({
      photosTemp : this.state.photosTemp.concat(photosTemp)
    })
  }

  deletePhotoTemp = photoName => () => {
    this.setState({
      photosTemp : this.state.photosTemp.filter(photo => photo.name !== photoName)
    })
  }

  //TODO: Mejorar la forma en que se muestran las fotos.
  render() {
    let imageKey = uuid.v4()

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
              <ImageUploader
                key={imageKey}
                withIcon={true}
                buttonText="Seleccionar Fotos"
                onChange={this.savePhotosTemp}
                imgExtension={['jpg', 'gif', 'png', 'jpeg']}
                maxFileSize={5242880}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Table>
                <TableBody>
                  {this.state.photosTemp.map((photoTemp, i) => (
                    <TableRow key={i}>
                      <TableCell align="left">
                        <img src={photoTemp.urlTemp} style={style.photo}/>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={this.deletePhotoTemp(photoTemp.name)}
                        >
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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