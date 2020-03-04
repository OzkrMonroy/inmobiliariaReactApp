import React from "react";
import { Toolbar, AppBar, Typography, IconButton, CircularProgress } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { useStyles } from "./defaultBarStyles";

const DefaultBar = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            HOMES
          </Typography>
          <CircularProgress size={24} color="inherit" />
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default DefaultBar;
