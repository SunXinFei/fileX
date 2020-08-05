import React, { Component } from 'react';
import propTypes, { func } from 'prop-types';
import { connect } from 'react-redux';
import "./style.scss";
import CreatableSelect from 'react-select/creatable';
import Immutable from 'immutable';
import { List } from 'immutable';

import { Divider } from 'antd';

import Tab1 from "./components/Tab1"
import Tab2 from "./components/Tab2"

class Introduction extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tabKey: "1"
		};
	}

	componentWillReceiveProps(nextProps) {
		if (!Immutable.is(this.props.selectedCardList, nextProps.selectedCardList)) {
			let hasDir = false
			nextProps.selectedCardList.forEach((s) => {
				if (s.type === 'file') {

				} else if (s.type === 'directory') {
					hasDir = true;
				}
			})
			if (hasDir) {
				this.changeTab('1')
			} else {
				this.changeTab('2')
			}
		}
	}

	componentWillMount() {
		this.getTab()
	}

	componentDidMount() {

	}
	/**
	 * 
	 */
	getTab() {
		if (this.props.selectedCardList.size === 0) {
			this.setState({ tabKey: "1" })
		}
	}
	/** */
	changeTab(tabKey) {
		this.setState({ tabKey })
	}

	render() {
		let { tabKey } = this.state
		return (
			<div className="filex-introduction">
				<div className="intro-tab">
					<span className={tabKey === '1' ? "intro-tab-name active" : "intro-tab-name"} onClick={() => { this.changeTab('1') }}>分类详情</span>
					<Divider type="vertical" />
					<span className={tabKey === '2' ? "intro-tab-name active" : "intro-tab-name"} onClick={() => { this.changeTab('2') }}>已选文件</span>
				</div>
				<div className="intro-content">
					{tabKey === '1' ? <Tab1 /> : <Tab2 />}
				</div>
			</div>
		);
	}
}

Introduction.propTypes = {
	selectedCardList: propTypes.instanceOf(List)
};

export default connect(
	(state) => ({
		selectedCardList: state.get('selectedCardList')
	})
)(Introduction);