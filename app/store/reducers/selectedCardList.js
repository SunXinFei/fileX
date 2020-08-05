import * as actionType from '../actionType';
import utils from '@app/utils';
import { fromJS, List } from 'immutable';
/**内容区域选中的card数组，单个item包含path路径、tpye类别、 */
let defaultState = utils.lastRecord && utils.lastRecord.selectedCardList && utils.lastRecord.selectedCardList.length !== 0 ?
  List(utils.lastRecord.selectedCardList) : List([]);

export default (state = defaultState, action = {}) => {
  switch (action.type) {
    case actionType.SETSELECTEDCARDLIST:
      return action.data;
    default:
      return state;
  }
};
