import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSessionStateValue } from '../session/sessionStore'

function AuthenticatedRoute({component: Component, authFirebase, ...propsComponent}) {
  const [{isAuthenticated}, dispatch] = useSessionStateValue()

  return (
    <Route
      {...propsComponent}
      render={(props) => (isAuthenticated === true || authFirebase !== null)
      ? <Component {...props} {...propsComponent} />
      : <Redirect to="/signin"/>
      } />
  )
}

export default AuthenticatedRoute