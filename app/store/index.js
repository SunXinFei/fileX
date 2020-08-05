import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { combineReducers } from 'redux-immutable';
import thunk from 'redux-thunk';
import Immutable from 'immutable';

const files = require.context('./reducers', false, /\.js$/)
const modules = {}

files.keys().forEach(key => {
  if (key === './index.js') return
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

let store = createStore(
	combineReducers(modules),
	Immutable.Map({}),
	composeWithDevTools(applyMiddleware(thunk))
);
window.$store = store;

export default store;
