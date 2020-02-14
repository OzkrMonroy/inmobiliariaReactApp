import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { Toolbar, Typography, withStyles, Button, IconButton, Drawer, Avatar } from '@material-ui/core'
import { compose } from 'recompose'

import { consumerFirebase } from '../../../server'
import { SignOutAction } from '../../../session/actions/sessionAction'
import { SessionStateContext } from '../../../session/sessionStore'

import { RightDrawerMenu } from './menus/RightDrawerMenu'
import { LeftDrawerMenu } from './menus/LeftDrawerMenu'
import userPhotoTemp from '../../../logo.svg'

//TODO: Optimizar los estilos
const styles = theme => ({
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')] : {
      display: 'flex'
    }
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')] : {
      display: 'none'
    }
  },
  grow: {
    flexGrow: 1
  },
  avatarSize: {
    width: 40,
    height: 40
  },
  list : {
    width: 240
  },
  listItemText : {
    fontSize: "16px",
    fontWeight: 600,
    paddingLeft: "15px",
    color: "#212121"
  }
})

//TODO: Optimizar esto con props (elemento firebase).
class BarSession extends Component {

  static contextType = SessionStateContext

  state = {
    firebase: null,
    right: false,
    left: false
  }

  static getDerivedStateFromProps(nextProps, prevState) {

    let newObjects = {}
    
    if(nextProps.firebase !== prevState.firebase){
      newObjects.firebase = nextProps.firebase
    }

    return newObjects
  }

  signOut = () => {
    const { firebase } = this.state
    const [{session}, dispatch] = this.context
    const {history} = this.props

    SignOutAction(dispatch, firebase)
    .then(succes => {
      history.push('/signin')
    })
  }

  toggleDrawer = (position, isOpen) => {
    this.setState({
      [position] : isOpen
    })
  }

  render() {
    const {classes} = this.props
    const [{session}, dispatch] = this.context
    const {user} = session
    const textUser = `${user.name} ${user.lastName}`

    return (
      <div>
        <Drawer
          open={this.state.left}
          onClose={() => this.toggleDrawer("left", false)}
          anchor="left"
        >
          <div
            role="button"
            onClick={() => this.toggleDrawer("left", false)}
            onKeyDown={() => this.toggleDrawer("left", false)}
          >
            <LeftDrawerMenu styleClasses={classes}/>
          </div>
        </Drawer>
        <Drawer
          open={this.state.right}
          onClose={() => this.toggleDrawer("right", false)}
          anchor="right"
        >
          <div
            role="button"
            onClick={() => this.toggleDrawer("right", false)}
            onKeyDown={() => this.toggleDrawer("right", false)}
          >
            <RightDrawerMenu styleClasses={classes} user={user} textUser={textUser} urlUserPhoto={userPhotoTemp} SignOutAction={this.signOut}/>
          </div>
        </Drawer>

        <Toolbar>
          <IconButton color="inherit" onClick={() => this.toggleDrawer("left", true)}>
            <i className="material-icons">menu</i>
          </IconButton>
          <Typography variant="h6">
            HOMES
          </Typography>          
          <div className={classes.grow}></div>
          <div className={classes.sectionDesktop}>
            <IconButton color="inherit" component={Link} to="">
              <i className="material-icons">mail_outline</i>
            </IconButton>
            <Button color="inherit" onClick={this.signOut}>Signout</Button>
            <Button color="inherit">{textUser}</Button>
            <Avatar src={userPhotoTemp}></Avatar>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton color="inherit" onClick={() => this.toggleDrawer("right", true)}>
              <i className="material-icons">more_vert</i>
            </IconButton>
          </div>
        </Toolbar>
      </div>
    )
  }
}

export default compose(withStyles(styles), consumerFirebase, withRouter)(BarSession);