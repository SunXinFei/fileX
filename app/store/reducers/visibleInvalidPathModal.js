import * as actionType from '../actionType';
import utils from '@app/utils';

let defaultState = "";

export default (state = defaultState, action = {}) => {
  switch (action.type) {
    case actionType.SETVISIBLEINVALIDPATHMODAL:
      return action.data;
    default:
      return state;
  }
};
