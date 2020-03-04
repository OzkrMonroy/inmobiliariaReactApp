import React, { Component } from 'react';
import { AppBar, withStyles } from '@material-ui/core'
import { compose } from 'recompose'

import { consumerFirebase } from '../../server'
import { SessionStateContext } from '../../session/sessionStore'

import BarSession from './bar/BarSession';
import DefaultBar from './bar/defaultBar/DefaultBar';

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
  }
})

class AppNavbar extends Component {

  static contextType = SessionStateContext

  state = {
    firebase: null
  }

  //TODO: Optimizar esta parte
  componentDidMount(){
    const { firebase } = this.state
    const [{ session }, dispatch ] = this.context

    if(firebase.auth.currentUser != null && !session){
      firebase.db
      .collection('Users')
      .doc(firebase.auth.currentUser.uid)
      .get()
      .then(doc => {
        const userDB = doc.data()

        dispatch({
          type: 'SIGNIN',
          session: userDB,
          isAuthenticated : true
        })
      })
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {

    let newObjects = {}
    
    if(nextProps.firebase !== prevState.firebase){
      newObjects.firebase = nextProps.firebase
    }

    return newObjects
  }

  render() {
    const [{session}, dispatch ] = this.context

    return session ? (session.isAuthenticated ? (
      <div>
        <AppBar position='static'>
          <BarSession/>
        </AppBar>
      </div>
    ): <DefaultBar/> )
    : <DefaultBar/>
  }
}

export default compose(withStyles(styles), consumerFirebase)(AppNavbar);