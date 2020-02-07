# Configurando un tema en Material-UI

Material-UI posee colors predeterminados que suelen dar a nuestra aplicación un buen aspecto, sin embargo, puede suceder que deseemos cambiar estos colores y alguno que otro estilo. Para establecer un **tema** vamos a realizar los siguientes pasos:

* Crear una carpeta denominada theme
* Crear un archivo llamado theme.js (o bien llamarlo index ó darle el nombre que prefieras).
* Dentro del archivo escribimos lo siguiente:
  ```
  import { createMuiTheme } from '@material-ui/core/styles'

  const theme = createMuiTheme({
    typography: {
      useNextVariants: true
    },
    palette : {
      primary : {
        main: '#10A75F'
      },
      common: {
        white: 'white'
      },
      secondary: {
        main: '#e53935'
      }
    },
    spacing: 10
  })

  export default theme
  ```
* Para utilizarlo vamos a dirigirnos a nuestro archivo **App.js** y colocamos lo siguiente:

  ```
  import React, { Component } from 'react';
  import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
  import { Grid } from '@material-ui/core';
  //Theme settings
  import { MuiThemeProvider } from '@material-ui/core/styles'
  import theme from './theme/theme'

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
  ```

**MuiThemeProvider** a través de su atributo **theme** nos permite indicarle cual va a ser el tema que deberá implementar a los elementos de la aplicación. Todos los elementos que se encuentren dentro se verán afectados por el tema establecido.