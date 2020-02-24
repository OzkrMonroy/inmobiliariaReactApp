import React, { Component } from 'react';
import { Container, Paper, Grid, Breadcrumbs, Typography, TextField, Button } from '@material-ui/core';
import { Link } from 'react-router-dom'
import HomeIcon from '@material-ui/icons/Home'

import { style } from './newHomeStyle'

class NewHome extends Component {
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
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="city"
                label="Ciudad"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="country"
                label="País"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                name="description"
                label="Descripción del Inmueble"
                fullWidth
                multiline
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                name="insideDescription"
                label="Descripción del interior del Inmueble"
                fullWidth
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

export default NewHome;