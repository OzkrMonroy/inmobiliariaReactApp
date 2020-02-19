import React, { useState, useEffect} from 'react'
import { Container } from '@material-ui/core'
// Global State
import { useSessionStateValue } from '../../../session/sessionStore'
import { styles } from './userProfileStyles'

let initialState = {
  userName: '',
  userLastName: '',
  userEmail: '',
  userPhone: '',
  userUrlPhoto: '',
  userId: ''
}

const UserProfile = ({props}) => {
  const [{session}, dispatch] = useSessionStateValue()
  let [userState, setUserState] = useState(initialState)


  return (
    session
    ?(
      <Container component="main" maxWidth="md" justify="center">
        <div className={styles.paper}></div>
      </Container>
    )
    : null
  );
}
 
export default UserProfile;
