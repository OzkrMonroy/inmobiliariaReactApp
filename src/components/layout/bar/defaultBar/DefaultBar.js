import React, { useState, useEffect } from "react";
import { Toolbar, AppBar, Typography, IconButton, CircularProgress } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { useStyles } from "./defaultBarStyles";

const DefaultBar = () => {
  const classes = useStyles();

  const [show, setShow] = useState(true);

  useEffect(() => {
    hiddeBar()
  });

  const hiddeBar = () => {
    setTimeout(() => {
      setShow(false);
    }, 3000);
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        {show ? (
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              HOMES
            </Typography>
            <CircularProgress size={24} color="inherit" />
          </Toolbar>
        ) : <Toolbar></Toolbar> }
      </AppBar>
    </div>
  );
};

export default DefaultBar;
