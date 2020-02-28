import React, { Component } from 'react';
import { Container, Paper, Grid, Breadcrumbs, Link, Typography, TextField, Card, CardContent, CardActions, Button, CardMedia } from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home'

import { style } from './inmueblesListStyle'
import logo from '../../../logo.svg'
import { consumerFirebase } from '../../../server';

class InmueblesList extends Component {

  state = {
    houses: [],
    searchText: ""
  }

  setSearchText = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
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
      houses : housesArray
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
              {this.state.houses.map(house => (
                <Grid item key={house.id} xs={12} ms={6} md={4}>
                  <Card style={style.card}>
                    <CardMedia 
                      style={style.cardMedia}
                      image={
                        house.photos ? house.photos[0] : logo
                      }
                      title="My House"
                    />
                    <CardContent style={style.cardContet}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {`${house.city}, ${house.country}`}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        color="primary"
                      >
                        Editar
                      </Button>
                      <Button
                        size="small"
                        color="secondary"
                      >
                        Eliminar
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }
}

export default consumerFirebase(InmueblesList);
