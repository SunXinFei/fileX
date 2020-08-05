import * as actionType from '../actionType';
import utils from '@app/utils';
import { Map } from 'immutable';

let defaultState = Map({ filePath: "", fileName:"", visible: false });

export default (state = defaultState, action = {}) => {
  switch (action.type) {
    case actionType.SETREADERMODALOBJ:
      return action.data;
    default:
      return state;
  }
};
