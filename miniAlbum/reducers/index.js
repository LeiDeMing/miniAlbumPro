import {
  createStore,
  combineReducers
} from './redux.min.js'
import userInfo from './userInfo.js'

export default createStore(combineReducers({
  userInfo
}))