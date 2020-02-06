import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import './App.css';
import { Grid } from '@material-ui/core';
//Theme settings
import { MuiThemeProvider } from '@material-ui/core/styles'
import theme from './theme/theme'
// Components
import InmueblesList from './components/views/InmueblesList';
import AppNavbar from './components/layout/AppNavbar';
import SignupForm from './components/forms/SignupForm';

class App extends Component {
  render(){
    return (
      <Router>
        <MuiThemeProvider theme={theme}>
          <AppNavbar/>
          <Grid container>
            <Switch>
              <Route path="/" exact component={InmueblesList}/>
              <Route path="/signup" exact component={SignupForm}/>
            </Switch>
          </Grid>
        </MuiThemeProvider>
      </Router>
    )
  }
}

export default App;
