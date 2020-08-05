import * as actionType from '../actionType';
import utils from '@app/utils';
import { fromJS, List } from 'immutable';

let defaultState = utils.lastRecord && utils.lastRecord.folderPathLocal && utils.lastRecord.folderPathLocal.length !== 0 ?
  List(utils.lastRecord.folderPathLocal) : List([]);

export default (state = defaultState, action = {}) => {
  switch (action.type) {
    case actionType.ADDFOLDERPATHFORLOCAL:
      return action.data;
    default:
      return state;
  }
};
