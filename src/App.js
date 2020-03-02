import React, { useState, useEffect, useContext, Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Grid } from "@material-ui/core";
//Theme settings
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "./theme/theme";
// Components
import InmueblesList from "./components/views/ListHomes/InmueblesList";
import AppNavbar from "./components/layout/AppNavbar";
import SignupForm from "./components/forms/SignupForm/SignupForm";
import SigninForm from "./components/forms/SigninForm/SigninForm";
import SnackBar from "./components/snackBar/SnackBar";
import UserProfile from "./components/views/userProfile/UserProfile";
import NewHome from "./components/views/newHome/NewHome";
import EditHome from "./components/views/editHome/EditHome";

// Auth and security
import AuthenticatedRoute from "./auth/AuthenticatedRoute";
import { FirebaseContext } from "./server";

//Representación del context Provider
import { useSessionStateValue } from "./session/sessionStore";

function App(props) {
  let firebase = useContext(FirebaseContext);
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);

  const [{ openSnackBar }, dispatch] = useSessionStateValue();

  useEffect(() => {
    firebase.isReady().then(val => {
      setIsFirebaseReady(val);
    });
  }, [firebase]);

  //TODO: Crear un Spinner mientras carga los datos

  return isFirebaseReady !== false ? (
    <Fragment>
      <SnackBar openSnackBar={openSnackBar} dispatch={dispatch} />

      <Router>
        <MuiThemeProvider theme={theme}>
          <AppNavbar />
          <Grid container>
            <Switch>
              <AuthenticatedRoute
                exact
                path="/"
                authFirebase={firebase.auth.currentUser}
                component={InmueblesList}
              />
              <AuthenticatedRoute
                exact
                path="/user/profile"
                authFirebase={firebase.auth.currentUser}
                component={UserProfile}
              />
              <AuthenticatedRoute
                exact
                path="/homes/new"
                authFirebase={firebase.auth.currentUser}
                component={NewHome}
              />
              <AuthenticatedRoute
                exact
                path="/homes/edit/:id"
                authFirebase={firebase.auth.currentUser}
                component={EditHome}
              />
              <Route path="/signup" exact component={SignupForm} />
              <Route path="/signin" exact component={SigninForm} />
            </Switch>
          </Grid>
        </MuiThemeProvider>
      </Router>
    </Fragment>
  ) : null;
}

export default App;
