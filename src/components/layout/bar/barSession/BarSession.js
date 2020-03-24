import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { Toolbar, Typography, withStyles, Button, IconButton, Drawer, Avatar } from '@material-ui/core'
import { compose } from 'recompose'

import { consumerFirebase } from '../../../../server'
import { SignOutAction } from '../../../../session/actions/sessionAction'
import { SessionStateContext } from '../../../../session/sessionStore'

import { RightDrawerMenu } from '../menus/RightDrawerMenu'
import { LeftDrawerMenu } from '../menus/LeftDrawerMenu'

import userPhotoTemp from '../../../../logo.svg'
import { styles } from './barSessionStyles'
import { getNotificationPermission } from '../../../../session/actions/notificationAction'

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

  getUserNotificationPermission = async () => {
    const {firebase} = this.props
    const [{session}, dispatch] = this.context
    const {user} = session

    if(firebase.messaginValidation.isSupported()){
      await getNotificationPermission(firebase, user, dispatch)
    }
  }

  render() {
    const {classes} = this.props
    const [{session}, dispatch] = this.context
    const {user} = session
    let textUser = `${user.name} ${user.lastName}`

    if(!user.name){
      textUser = user.phoneNumber
    }

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
            <LeftDrawerMenu styleClasses={classes} 
              getUserNotificationPermission={this.getUserNotificationPermission}/>
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
            <Button color="inherit" onClick={this.signOut}>Salir</Button>
            <Button color="inherit">{textUser}</Button>
            <Avatar src={user.photo || userPhotoTemp}></Avatar>
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