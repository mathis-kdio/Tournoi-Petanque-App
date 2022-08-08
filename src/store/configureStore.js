// Store/configureStore.js

import { createStore } from 'redux'
import toggleJoueur from './reducers/joueurReducer'
import listesJoueurs from './reducers/listesJoueursReducer'
import gestionMatchs from './reducers/matchsReducer'
import listeTournois from './reducers/tournoisReducer'
import optionsTournoi from './reducers/optionsTournoiReducer'
import { persistCombineReducers } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage';

const rootPersistConfig = {
  key: 'root',
  storage: AsyncStorage,
}

export default createStore(persistCombineReducers(rootPersistConfig, {listesJoueurs, toggleJoueur, gestionMatchs, listeTournois, optionsTournoi}))