import React, { Component } from 'react';
import { Container, Paper, Grid, Breadcrumbs, Link, Typography, TextField, ButtonGroup, Button } from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home'
import { ArrowLeft, ArrowRight } from '@material-ui/icons'

import { style } from './inmueblesListStyle'
import logo from '../../../logo.svg'
import { consumerFirebase } from '../../../server';
import CardListHomes from './cards/CardListHomes';
import { SecondarySpinner } from '../../spinner';
import AlertDialog from './alerts/AlertDialog';
import { getData } from '../../../session/actions/InmueblesListAction';

class InmueblesList extends Component {

  state = {
    houses: [],
    searchText: "",
    pageResult: [],
    pageSize: 1,
    initialHouse: null,
    currentlyPage: null,
    isLoading: true,
    alertIsOpen: false,
    houseToDelete: {}
  }

  async componentDidMount() {
    const { pageSize, searchText, initialHouse, pageResult } = this.state
    const { firebase } = this.props

    const firebaseReturnData = await getData(firebase, pageSize, initialHouse, searchText )

    const page = {
      firstHouse : firebaseReturnData.firstHouse,
      lastHouse: firebaseReturnData.lastHouse
    }

    pageResult.push(page)

    this.setState({
      houses: firebaseReturnData.housesArray,
      pageResult,
      currentlyPage: 0,
      isLoading: false
    })
  }

  setSearchText = e => {
    const self = this

    self.setState({
      [e.target.name]: e.target.value,
      isLoading: true
    })

    if(self.state.typingTimeOut){
      clearTimeout(self.state.typingTimeOut)
    }

    self.setState({
      name : e.target.value,
      typing: false,
      typingTimeOut : setTimeout(() => {
        let objectQuery = self.props.firebase.db
        .collection("Homes")
        .orderBy("address")
        .where("keywords", "array-contains", self.state.searchText.toLowerCase())

        if(self.state.searchText.trim() === ""){
          objectQuery = self.props.firebase.db
          .collection("Homes")
          .orderBy("address")
        }

        objectQuery.get().then(snapshot => {
          const housesArray = snapshot.docs.map(doc => {
            let data = doc.data()
            let id = doc.id

            return {id, ...data}
          })

          self.setState({
            houses : housesArray,
            isLoading: false
          })
        })
      }, 500)
    })
  }

  setDataForDelete = (house, alertIsOpen) => {
    this.setState({
      houseToDelete: house,
      alertIsOpen
    })
  }

  deleteHouseFromFirestore = house => {
    const { firebase } = this.props

    const houseName = `${house.address}_${house.city}_${house.country}`.replace(/\s/g, '_').toLowerCase()

    house.photos.forEach(async photo => {
      
      await firebase.deleteFileInStorage(photo.name, firebase.auth.currentUser.uid, houseName)
    })

    firebase.db
    .collection("Homes")
    .doc(house.id)
    .delete()
    .then(succes =>{
      this.deleteHouseFromState(house.id)
    })
  }

  deleteHouseFromState = id => {
    const newHousesList = this.state.houses.filter(house => house.id !== id)

    this.setState({
      houses : newHousesList
    })
  }

  redirectToEditHouse = id => {
    this.props.history.push(`/homes/edit/${id}`)
  }

  nextPage = () => {
    const { pageSize, searchText, initialHouse, pageResult, currentlyPage } = this.state
    const { firebase } = this.props

    this.setState({
      isLoading: true
    })

    getData(firebase, pageSize, pageResult[currentlyPage].lastHouse, searchText )
    .then(firebaseReturnData => {
      if(firebaseReturnData.housesArray.length > 0 ) {
        const page = {
          firstHouse : firebaseReturnData.firstHouse,
          lastHouse: firebaseReturnData.lastHouse
        }
    
        pageResult.push(page)
    
        this.setState({
          houses: firebaseReturnData.housesArray,
          pageResult,
          currentlyPage: currentlyPage + 1,
          isLoading: false
        })
      }
    })
  }

  render() {
    return (
      <Container style={style.cardGrid}>
        <Paper style={style.paper}>
          <Grid item xs={12} ms={12}>
            <Breadcrumbs aria-label="breadcrumbs">
              <Link color="inherit" style={style.link} to="/">
                <HomeIcon/>
                Home
              </Link>
              <Typography color="textPrimary">Mis inmuebles</Typography>
            </Breadcrumbs>
          </Grid>

          <Grid item xs={12} ms={12} style={style.gridTextField}>
            <TextField
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
              name="searchText"
              label="Buscar inmueble"
              value={this.state.searchText}
              onChange={this.setSearchText}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} ms={12} style={style.buttonsBar}>
            <Grid container spacing={1} direction="column" alignItems="flex-end">
              <ButtonGroup size="small" aria-label="small outlined group">
                <Button>
                  <ArrowLeft/>
                </Button>
                <Button onClick={this.nextPage}>
                  <ArrowRight/>
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>

          <Grid item xs={12} ms={12} style={style.gridTextField}>
            <Grid container spacing={4}>
              {this.state.isLoading ?
                <Grid item xs={12} style={style.spinnerContainer}>
                  <SecondarySpinner color="primary" size={50} containerHeight={style.height} />
                </Grid>
               : this.state.houses.map(house => (
                <CardListHomes
                  key={house.id}
                  item={house}
                  style={style}
                  redirectToEditHouse={this.redirectToEditHouse}
                  setDataForDelete={this.setDataForDelete}
                  logo={logo}
                />
              ))}
            </Grid>
          </Grid>
        </Paper>
        <AlertDialog house={this.state.houseToDelete} isOpen={this.state.alertIsOpen} deleteHouseFromFirestore={this.deleteHouseFromFirestore} setDataForDelete={this.setDataForDelete}/>
      </Container>
    );
  }
}

export default consumerFirebase(InmueblesList);
