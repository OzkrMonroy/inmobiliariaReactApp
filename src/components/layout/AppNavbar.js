import React, { Component } from 'react';
import { AppBar, Toolbar } from '@material-ui/core'

class AppNavbar extends Component {
  render() {
    return (
      <div>
        <AppBar position='static'>
          <Toolbar></Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default AppNavbar;