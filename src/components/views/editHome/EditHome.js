import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Container, Paper, Grid, Breadcrumbs, Typography, TextField, Button } from '@material-ui/core';
import ImageUploader from 'react-images-upload'
import HomeIcon from '@material-ui/icons/Home'
import { style } from './editHomeStyles'
import { displaySnackBar } from '../../../session/actions/snackBarAction'
import PhotosSelectedList from '../../photosList/PhotosSelectedList';
import { SecondarySpinner } from '../../spinner';

import uuid from 'uuid';

import { consumerFirebase } from '../../../server'
import { SessionStateContext } from '../../../session/sessionStore'
import { createKeywords } from '../../../session/actions/Keyword';
import { initialHomeState } from '../../../utils'

class EditHome extends Component {

  static contextType = SessionStateContext

  state = {
    newHomeData : initialHomeState,
    photosTemp: [],
    isLoading: true,
    isSaved: false
  }

  async componentDidMount() {
    const { id } = this.props.match.params
    const { firebase } = this.props

    const homeData = await firebase.getDocumentFromFirestore('Homes', id)

    this.setState({
      newHomeData : homeData.data(),
      isLoading: false
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
    const { newHomeData } = this.state
    const { firebase, history } = this.props
    const { id } = this.props.match.params
    const [{session}, dispatch] = this.context

    this.setState({
      isSaved: true
    })

    const searchText = `${newHomeData.address} ${newHomeData.city} ${newHomeData.country}`
    let keywords = createKeywords(searchText)

    newHomeData.keywords = keywords
    newHomeData.createdBy = firebase.auth.currentUser.uid

    firebase.updateDocumentToFirestore('Homes', id, newHomeData)
    .then(success => {
      history.push('/')
      this.setState({
        isSaved: false
      })
      displaySnackBar(dispatch, {
        isOpen : true,
        message: `Los datos se actualizaron correctamente.`
      })
    })

  }

  savePhotosTemp = photosTemp => {
    const { newHomeData } = this.state
    const { firebase } = this.props
    const { id } = this.props.match.params
    const [{session}, dispatch] = this.context

    this.setState({
      isLoading: true
    })

    const houseName = `${newHomeData.address}_${newHomeData.city}_${newHomeData.country}`.replace(/\s/g, '_').toLowerCase()

    Object.keys(photosTemp).forEach(key => {
      photosTemp[key].alias = photosTemp[key].name.replace(/\s/g, '_').toLowerCase()
    })

    firebase.saveFilesInStorage(photosTemp, firebase.auth.currentUser.uid, houseName)
            .then(urlArray => {
              urlArray.forEach((url, i) => {
                const data = {
                  name: photosTemp[i].alias,
                  url: url
                }

                newHomeData.photos = newHomeData.photos.concat(data)
              })

              firebase.updateDocumentToFirestore('Homes', id, newHomeData)
              .then(success => {
                this.setState({
                  newHomeData,
                  isLoading: false
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

  deletePhotoTemp = photoS => async () => {
    const { newHomeData } = this.state
    const { firebase } = this.props
    const { id } = this.props.match.params
    const [{session}, dispatch] = this.context

    this.setState({
      isLoading: true
    })

    const houseName = `${newHomeData.address}_${newHomeData.city}_${newHomeData.country}`.replace(/\s/g, '_').toLowerCase()

    await firebase.deleteFileInStorage(photoS.name, firebase.auth.currentUser.uid, houseName)

    let photoList = newHomeData.photos.filter(photo => photo.url !== photoS.url)

    newHomeData.photos = photoList

    firebase.updateDocumentToFirestore('Homes', id, newHomeData)
    .then(success => {
      this.setState({
        newHomeData,
        isLoading: false
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
    let imageKey = uuid.v4()
    const { isLoading, isSaved } = this.state
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
              <PhotosSelectedList 
                isLoading={isLoading}
                deletePhotoTemp={this.deletePhotoTemp}
                style={style}
                photos={this.state.newHomeData.photos}
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
                {isSaved ? <SecondarySpinner color="inherit" containerHeight={style.buttonHeight} size={24} /> : "Guardar"}
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