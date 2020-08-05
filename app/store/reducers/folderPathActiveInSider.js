import * as actionType from '../actionType';
import utils from '@app/utils';

let defaultState = utils.lastRecord && utils.lastRecord.folderPathActiveInSider ?
  utils.lastRecord.folderPathActiveInSider : '';

export default (state = defaultState, action = {}) => {
  switch (action.type) {
    case actionType.SETFOLDERPATHACTIVEINSIDER:
      return action.data;
    default:
      return state;
  }
};
