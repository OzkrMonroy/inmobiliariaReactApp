import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Container, Paper, Grid, Breadcrumbs, Typography, TextField, Button, Table, TableBody, TableRow, TableCell } from '@material-ui/core';
import ImageUploader from 'react-images-upload'
import HomeIcon from '@material-ui/icons/Home'
import { style } from './editHomeStyles'

import uuid from 'uuid';

import { consumerFirebase } from '../../../server'

const initialState = {
  address: '',
  city: '',
  country: '',
  description: '',
  insideDescription: '',
  photos: [],
  keywords: []
}

class EditHome extends Component {

  state = {
    newHomeData : initialState,
    photosTemp: []
  }

  async componentDidMount() {
    const { id } = this.props.match.params
    const { firebase } = this.props

    const homeCollection = firebase.db.collection("Homes")
    const homeData = await homeCollection.doc(id).get()

    this.setState({
      newHomeData : homeData.data()
    })
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

//TODO: Crear un componente para los elementos que muestran las fotos.
  render() {
    let imageKey = uuid.v4()

    return (
      <Container style={style.container}>
        <Paper style={style.paper}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" style={style.link} to="/">
                  <HomeIcon style={style.homeIcon}/>
                  Home
                </Link>
                <Typography color="textPrimary">Editar Inmueble</Typography>
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
                  {this.state.newHomeData.photos
                  ? this.state.newHomeData.photos.map((photo, i) => (
                    <TableRow key={i}>
                      <TableCell align="left">
                        <img src={photo} style={style.photo}/>
                      </TableCell>
                      <TableCell aling="left">
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={this.deletePhotoTemp(photo)}
                        >
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                  : ""}
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

          </Grid>
        </Paper>
      </Container>
    );
  }
}

export default consumerFirebase(EditHome);