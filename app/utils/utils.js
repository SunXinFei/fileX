
const electron = require('electron');
import { resolve } from 'path'
import fsExtra from 'fs-extra';
import { List } from 'immutable';
import * as actionType from '@app/store/actionType';

/**
 * 本地存储常量Key
 */
export const StorageKey = "FILEX_STORE"

const dataPath = (electron.app || electron.remote.app).getPath('userData');
const userDataPath = resolve(dataPath, './FileX/filex');
const targetPath = resolve(userDataPath, './fileX.md')
const mdFilePath = resolve(__dirname, '../fileX.md')
const fileXDirDataPath = resolve(dataPath, './FileX/data')
fsExtra.ensureDirSync(fileXDirDataPath)
export const fileXDataPath = resolve(fileXDirDataPath, './filex.db');

/**
 * 拷贝md文件到用户数据层
 */
const getEmptyFolderPathLocal = () => {
	fsExtra.copySync(mdFilePath, targetPath)
	return List([userDataPath])
}

/**
 * 将Redux中store的变化本地持久化
 * @param {Object} store
 */
export const subscribeRecord = (store) => { // 将状态记录到 localStorage
	store.subscribe(() => {
		//如果初始话sider列表为空且没有初始过md文件,则创建默认文件夹并选中该文件夹
		if (store.getState().get('folderPathLocal').size === 0 && !fsExtra.pathExistsSync(targetPath)) {
			//添加到边栏
			store.dispatch({
				type: actionType.ADDFOLDERPATHFORLOCAL,
				data: getEmptyFolderPathLocal()
			})
			//选中该文件夹
			store.dispatch({
				type: actionType.SETFOLDERPATHACTIVEINSIDER,
				data: userDataPath
			});
			console.info('%c 如果初始话sider列表为空,则创建默认文件夹并选中该文件夹', 'color:blue;')
			return
		}
		let data = store.getState().toJS();
		data = JSON.stringify(data);
		data = encodeURIComponent(data);
		if (window.btoa) {
			data = btoa(data);
		}
		localStorage.setItem(StorageKey, data);
	});
}

/**
 * 将持久化数据读取出来
 * @return {Object} 持久化数据
 */
export const lastRecord = (() => { // 上一把的状态
	let data = localStorage.getItem(StorageKey);
	if (!data) {
		return false;
	}
	try {
		if (window.btoa) {
			data = atob(data);
		}
		data = decodeURIComponent(data);
		data = JSON.parse(data);
	} catch (e) {
		if (window.console || window.console.error) {
			window.console.error('读取记录错误:', e);
		}
		return false;
	}
	// console.log(data, 'lastRecordData');
	return data;
})();

/**
 * 用于文件入库的主键
 * 时间戳以及随机数
 * @return {String} 随机唯一主键
 */
export const guid = () => {
	return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
}

/**
 * 获取文件名称，通过文件全称
 * @param {String} filename 文件全称 如: example.exe
 * @param {String} ext 拓展名 如：.exe
 * @return {String} 文件名称 如: example
 */
export const getFileName = (filename, ext) => {
	return filename.replace(ext, '')
}

/**
 * 清除event默认事件，（废弃）
 */
export function clearEventBubble(e) {
	if (e.stopPropagation) e.stopPropagation()
	else e.cancelBubble = true

	if (e.preventDefault) e.preventDefault()
	else e.returnValue = false
}

/**
 * 监测目标文件是否在框选范围
 * 利用碰撞检测框选select与目标文件taget
 * @param {Object} select 框选范围的位置信息
 * @param {Object} target 目标文件对象，所在位置信息
 * @param {Object} container 容器，用于计算相对于window的css偏移
 * @param {Number} scrollTop 容器的top滚动值
 * @param {Number} scrollLeft 容器的left滚动值
 * @return {Boolean} 文件是否在框选范围结果
 */
export const checkInRect = (select, target, container, scrollTop, scrollLeft) =>{
	let a = {
		gridx: target.left - container.left + scrollLeft,
		gridy: target.top - container.top + scrollTop,
		width: target.width,
		height: target.height
	}
	let b = {
		gridx: select.left,
		gridy: select.top,
		width: select.width,
		height: select.height
	}
	return collision(a,b);
}

/**
 * 碰撞检测代码，监测两个模块是否进行交叠，
 * 利用两模块的原点坐标以及宽高值
 * @param {Object} a 
 * @param {Object} b 
 * @return {Boolean} 是否交叠结果
 */
export const collision = (a, b) => {
	if (a.gridx === b.gridx && a.gridy === b.gridy && a.width === b.width && a.height === b.height) {
		return true;
	}
	if (a.gridx + a.width <= b.gridx) return false; //a处于b的左方
	if (a.gridx >= b.gridx + b.width) return false; //a处于b的右方
	if (a.gridy + a.height <= b.gridy) return false; //a处于b的上方
	if (a.gridy >= b.gridy + b.height) return false; //a处于b的下方
	return true;
};
/**
 * 判断当前文件是否被选中，-1为未选中 
 * @param {List} 选中卡片列表
 * @param {String} 目标卡片路径
 * @return {Number} 选中的index
 */
export const getSelectedIndex = (selectedCardList, path) => {
	let result = -1;
	selectedCardList.forEach((item, index) => {
		if (item.path === path) {
			result = index;
			return false;
		}
	})
	return result;
}