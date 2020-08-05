import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd-cjs'
import HTML5Backend from 'react-dnd-html5-backend-cjs'
import { hot } from 'react-hot-loader/root';
import store from '@app/store';
import '@app/style/index.scss';
import utils from '@app/utils';
import Container from '@app/views/Container'
import { ConfigProvider } from 'antd';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/es/locale/zh_CN';

utils.subscribeRecord(store); // 将redux更新的状态记录到localStorage

function Root() {
	return (
		<Provider store={store}>
			<DndProvider backend={HTML5Backend}>
				<ConfigProvider locale={zhCN}>
					<Container />
				</ConfigProvider>
			</DndProvider>
		</Provider>
	)
}

export default hot(Root);
