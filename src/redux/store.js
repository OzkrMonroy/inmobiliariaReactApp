import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'

const initialState = {}
const middleware = [thunk]

const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS__EXTENSION__ ? window.__REACT_DEVTOOLS__EXTENSION 
    && window.__REACT_DEVTOOLS__EXTENSION() : f => f
  )
)

export default store