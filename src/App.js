import React, { useState, useEffect, useContext } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import { Grid } from '@material-ui/core';
//Theme settings
import { MuiThemeProvider } from '@material-ui/core/styles'
import theme from './theme/theme'
// Components
import InmueblesList from './components/views/InmueblesList';
import AppNavbar from './components/layout/AppNavbar';
import SignupForm from './components/forms/SignupForm/SignupForm';
import SigninForm from './components/forms/SigninForm/SigninForm';

import { FirebaseContext } from './server'

function App(props) {

  let firebase = useContext(FirebaseContext)
  const [isFirebaseReady, setIsFirebaseReady] = useState(false)

  useEffect(() => {
    firebase.isReady()
            .then(val => {
              setIsFirebaseReady(val)
            })
  }, [firebase])

  return isFirebaseReady !== false ? (
    <Router>
      <MuiThemeProvider theme={theme}>
        <AppNavbar/>
        <Grid container>
          <Switch>
            <Route path="/" exact component={InmueblesList}/>
            <Route path="/signup" exact component={SignupForm}/>
            <Route path="/signin" exact component={SigninForm}/>
          </Switch>
        </Grid>
      </MuiThemeProvider>
    </Router>
  )
  : null
}

export default App;
