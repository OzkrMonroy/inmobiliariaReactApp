import React from 'react'
import {Link} from 'react-router-dom'
import { List, ListItem, ListItemText, Divider } from '@material-ui/core'

export const LeftDrawerMenu = ({styleClasses}) => (
  <div className={styleClasses.list}>
    <List>
      <ListItem component={Link} button to="/user/profile" color="inherit">
        <i className="material-icons">account_box</i>
        <ListItemText classes={{primary: styleClasses.listItemText}} primary="Perfil"/>
      </ListItem>
    </List>
    <Divider/>
    <List>
      <ListItem component={Link} button to="">
        <i className="material-icons">add_box</i>
        <ListItemText classes={{primary: styleClasses.listItemText}} primary="Agregar Inmueble"/>
      </ListItem>
      <ListItem component={Link} button to="">
        <i className="material-icons">business</i>
        <ListItemText classes={{primary: styleClasses.listItemText}} primary="Inmuebles"/>
      </ListItem>
      <ListItem component={Link} button to="">
        <i className="material-icons">mail_outline</i>
        <ListItemText classes={{primary: styleClasses.listItemText}} primary="Mensajes"/>
      </ListItem>
    </List>
  </div>
)