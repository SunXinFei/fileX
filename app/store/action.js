import * as actionType from './actionType';
import fsExtra from 'fs-extra';
import { List } from 'immutable';

// 添加文件夹路径到本地
export const addFolderPathForLocal = (data) => {
	return (dispatch, getState) => {
		//若当前未选择文件夹并且边栏列表不为空,则默认选中第一个文件夹
		if (getState().get('folderPathActiveInSider') === '' && data.size !== 0) {
			dispatch(setFolderPathActiveInSider(data.get(0)))
		}
		//若当前文件夹列表为空,则清除当前选中的文件夹路径
		// if (data.size === 0) {
		// 	dispatch(setFolderPathActiveInSider(''))
		// }
		//设置边栏文件夹列表
		dispatch({
			type: actionType.ADDFOLDERPATHFORLOCAL,
			data
		});
	}
};

// 选择文件夹路径在边栏
export const setFolderPathActiveInSider = (data) => {
	return {
		type: actionType.SETFOLDERPATHACTIVEINSIDER,
		data
	};
}

// 选择文件夹路径在边栏
// 返回值 true/false:文件路径是/否存在
export const setFolderPathActiveInSiderAsync = (data) => {
	return async (dispatch) => {
		const exists = await fsExtra.pathExists(data);
		if (!exists) {
			return false;
		}
		//显示内容区域loading
		dispatch(setContentLoading(true));
		//设置当前内容区域的路径
		dispatch(setFolderPathActiveInSider(data));
		return true;
	}
}

//InvalidPathModal组件的无效路径
export const setVisibleInvalidPathModal = (data) => {
	return {
		type: actionType.SETVISIBLEINVALIDPATHMODAL,
		data
	};
}

//显示/隐藏内容区域的loading
export const setContentLoading = (data) => {
	return {
		type: actionType.SETCONTENTLOADING,
		data
	};
}

//设置undoList
export const setUndoList = (data) => {
	return {
		type: actionType.SETUNDOLIST,
		data
	};
}

//设置redoList
export const setRedoList = (data) => {
	return dispatch => {
		//清除选择卡片列表
		dispatch(setSelectedCardList(List([])))
		//设置redoList
		dispatch({
			type: actionType.SETREDOLIST,
			data
		});
	}
}

//设置readerModalObj
export const setReaderModalObj = (data) => {
	return {
		type: actionType.SETREADERMODALOBJ,
		data
	};
}


//设置SelectedCardList
export const setSelectedCardList = (data) => {
	return {
		type: actionType.SETSELECTEDCARDLIST,
		data
	};
}

