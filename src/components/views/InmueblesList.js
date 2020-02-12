import React, { Component } from 'react';
import { Button } from '@material-ui/core'

class InmueblesList extends Component {
  render() {
    return (
      <div>
        <Button variant="contained" color="primary" >Botón primario</Button>
        <Button variant="outlined" color="secondary">Botón secundario</Button>
      </div>
    );
  }
}

export default InmueblesList;
