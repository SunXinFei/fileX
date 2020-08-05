import * as actionType from '../actionType';
import utils from '@app/utils';
import { fromJS, List } from 'immutable';

let defaultState = utils.lastRecord && utils.lastRecord.undoPathList && utils.lastRecord.undoPathList.length !== 0 ?
  List(utils.lastRecord.undoPathList) : List([]);

export default (state = defaultState, action = {}) => {
  switch (action.type) {
    case actionType.SETUNDOLIST:
        // console.log(action.data.toJS(), 'undoList');
      return action.data;
    default:
      return state;
  }
};
