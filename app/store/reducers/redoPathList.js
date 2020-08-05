import * as actionType from '../actionType';
import utils from '@app/utils';
import { fromJS, List } from 'immutable';

let defaultState = utils.lastRecord && utils.lastRecord.redoPathList && utils.lastRecord.redoPathList.length !== 0 ?
  List(utils.lastRecord.redoPathList) : List([]);

export default (state = defaultState, action = {}) => {
  switch (action.type) {
    case actionType.SETREDOLIST:
      return action.data;
    default:
      return state;
  }
};
