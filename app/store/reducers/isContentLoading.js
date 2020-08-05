import * as actionType from '../actionType';
import utils from '@app/utils';

let defaultState = true;

export default (state = defaultState, action = {}) => {
  switch (action.type) {
    case actionType.SETCONTENTLOADING:
      return action.data;
    default:
      return state;
  }
};
