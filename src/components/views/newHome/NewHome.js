import React, { Component } from 'react';
import { Container, Paper, Grid, Breadcrumbs, Typography, TextField, Button, CircularProgress } from '@material-ui/core';
import { Link } from 'react-router-dom'
import HomeIcon from '@material-ui/icons/Home'
import ImageUploader from 'react-images-upload'

import { style } from './newHomeStyle'
import { displaySnackBar } from '../../../session/actions/snackBarAction'
import PhotosSelectedList from '../../photosList/PhotosSelectedList';

import { consumerFirebase } from '../../../server'
import { SessionStateContext } from '../../../session/sessionStore'
import { createKeywords } from '../../../session/actions/Keyword';
import { initialHomeState } from '../../../utils'

import uuid from 'uuid';

class NewHome extends Component {

  static contextType = SessionStateContext

  state = {
    newHomeData : initialHomeState,
    photosTemp: [],
    isSaved: false
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
    const { newHomeData, photosTemp } = this.state
    const { firebase, history } = this.props
    const [{session}, dispatch] = this.context

    this.setState({
      isSaved: true
    })

    const houseName = `${newHomeData.address}_${newHomeData.city}_${newHomeData.country}`.replace(/\s/g, '_').toLowerCase()

    const searchText = `${newHomeData.address} ${newHomeData.city} ${newHomeData.country}`
    let keywords = createKeywords(searchText)

    Object.keys(photosTemp).forEach(key => {
      photosTemp[key].alias = photosTemp[key].name.replace(/\s/g, '_').toLowerCase()
    })

    firebase.saveFilesInStorage(photosTemp, firebase.auth.currentUser.uid, houseName)
            .then(urlArray => {
              const photosArray = []
              urlArray.forEach((url, i) => {
                const data = {
                  name: photosTemp[i].alias,
                  url: url
                }

                photosArray.push(data)
              })
              newHomeData.photos = photosArray
              newHomeData.keywords = keywords
              newHomeData.createdBy = firebase.auth.currentUser.uid

              firebase.addDocumentToFirestore('Homes', newHomeData)
              .then(success => {
                history.push('/')
                this.setState({
                  isSaved: false
                })
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
            })
  }

  savePhotosTemp = photosTemp => {
    Object.keys(photosTemp).forEach(key => {
      photosTemp[key].url = URL.createObjectURL(photosTemp[key])
    })

    this.setState({
      photosTemp : this.state.photosTemp.concat(photosTemp)
    })
  }

  deletePhotoTemp = photoTemp => () => {
    this.setState({
      photosTemp : this.state.photosTemp.filter(photo => photo.name !== photoTemp.name)
    })
  }

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
            <PhotosSelectedList 
                isLoading={false}
                deletePhotoTemp={this.deletePhotoTemp}
                style={style}
                photos={this.state.photosTemp}
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
                {this.state.isSaved ? <CircularProgress color="inherit" size={24}/> : "Guardar"}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }
}

export default consumerFirebase(NewHome);