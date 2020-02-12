import React, { createContext, useContext, useReducer } from 'react'

export const SessionStateContext = createContext()

export const SessionStateProvider = ({reducer, initialState, children}) => (
  <SessionStateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </SessionStateContext.Provider>
)

//Reemplaza al consumer de versiones anteriores.
export const useSessionStateValue = () => useContext(SessionStateContext)