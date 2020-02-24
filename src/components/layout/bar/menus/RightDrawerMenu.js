import React from 'react'
import { List, ListItem, Link, Avatar, ListItemText } from "@material-ui/core";

//TODO: Mejorar los estilos de los items
export const RightDrawerMenu = ({styleClasses, user, textUser, urlUserPhoto, SignOutAction}) => (
  <div className={styleClasses.list}>
    <List>
      <ListItem button component={Link} to="/signin">
        <Avatar
          src={user.photo || urlUserPhoto}
        />
        <ListItemText
            classes={{primary: styleClasses.listItemText}}
            primary={textUser}
          />
      </ListItem>
      <ListItem button onClick={SignOutAction}>
        <ListItemText
          classes={{primary: styleClasses.listItemText}}
          primary="Salir"
        />
      </ListItem>
    </List>
  </div>
)