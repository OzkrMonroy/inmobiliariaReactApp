import React, { Component } from 'react';
import { Container, Paper, Grid, Breadcrumbs, Link, Typography, TextField } from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home'

import { style } from './inmueblesListStyle'
import logo from '../../../logo.svg'
import { consumerFirebase } from '../../../server';
import CardListHomes from '../../cards/CardListHomes';
import { SecondarySpinner } from '../../spinner';

class InmueblesList extends Component {

  state = {
    houses: [],
    searchText: "",
    isLoading: true
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

  deleteHouseFromFirestore = house => {
    const { firebase } = this.props

    const houseName = `${house.address}_${house.city}_${house.country}`

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

  async componentDidMount() {
    let objectQuery = this.props.firebase.db.collection("Homes").orderBy("address")

    const snapshot = await objectQuery.get()

    const housesArray = snapshot.docs.map(doc => {
      let data = doc.data()
      let id = doc.id

      return {id, ...data}
    })

    this.setState({
      houses : housesArray,
      isLoading: false
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
              label="Busque por dirección, ciudad o país"
              value={this.state.searchText}
              onChange={this.setSearchText}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} ms={12} style={style.gridTextField}>
            <Grid container spacing={4}>
              {this.state.isLoading ?
                <Grid item xs={12} style={style.spinnerContainer}>
                  <SecondarySpinner color="primary" size={50}/>
                </Grid>
               : this.state.houses.map(house => (
                <CardListHomes
                  key={house.id}
                  item={house}
                  style={style}
                  redirectToEditHouse={this.redirectToEditHouse}
                  deleteHouseFromFirestore={this.deleteHouseFromFirestore}
                  logo={logo}
                />
              ))}
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }
}

export default consumerFirebase(InmueblesList);
