import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import "./style.scss";

import { List } from 'immutable';
import fsExtra from 'fs-extra';
import { shell } from "electron";
import { setContentLoading, setSelectedCardList } from '@app/store/action';
const { treeJson } = require('kigi')

import ContentRouter from './components/ContentRouter'
import ContentOption from './components/ContentOption'
import Selection from './components/Selection'

import { message } from 'antd';

import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
     
      /**右击菜单是否展示,用来控制滚动 */
      isShowContextMenu: false
    };
  }
	/**
	 * 检测redux中被选中的文件夹路径的变化
	 * @param {*} nextProps 
	 */
  async componentWillReceiveProps(nextProps) {
    if (this.props.folderPathActiveInSider !== nextProps.folderPathActiveInSider) {
      if (nextProps.folderPathActiveInSider === '') {
        this.setState({ files: [] });
      } else {
        const treeForFolder = await treeJson(nextProps.folderPathActiveInSider, {
          level: 2
        })
        this.setState({ files: treeForFolder.children });
        this.props.setContentLoading(false);
      }

    }
  }

  async	componentDidMount() {
    //异常判断，判断文件夹是否在本地/远端存在
    if (this.props.folderPathActiveInSider === '') {
      this.props.setContentLoading(false);
      return
    }
    const exists = await fsExtra.pathExists(this.props.folderPathActiveInSider);
    if (!exists) {
      message.error('该路径已被删除或移动');
      return
    }
    const treeForFolder = await treeJson(this.props.folderPathActiveInSider, {
      level: 2
    });
    console.log(treeForFolder, 'treeForFolder');
    this.setState({ files: treeForFolder.children });
    this.props.setContentLoading(false);
  }

  
  /**
   * 右击菜单处理
   */
  handleContextMenuClick = async (e, data) => {
    switch (data.action) {
      case 'remove':
        console.log(data);
        break;
      case 'open-in-finder':
        //异常判断，判断文件夹是否在本地/远端存在
        const exists = await fsExtra.pathExists(data.path);
        if (!exists) {
          message.error('该路径已被删除或移动');
          return
        }
        shell.showItemInFolder(data.path);
        break;
      // this.removeFromSider(this.state.contextMenuTriggerIndex);
    }
  }
  /**右击菜单显示回调 */
  contextMenuShow = (e) => {
    const { file } = e.detail.data;
    //禁止滚动
    this.setState({
      isShowContextMenu: true
    })
    //选中卡片
    this.props.setSelectedCardList(List([{
      ...file
    }]))
  }
  /**右击菜单隐藏回调 */
  contextMenuHide = (e) => {
    this.setState({
      isShowContextMenu: false
    })
  }
  render() {
    const { isShowContextMenu, files } = this.state;
    return (
      <div className="filex-content">
        {/* 路由区域 */}
        <ContentRouter />
        {/* 卡片操作区域 */}
        <ContentOption />
        {/* 卡片区域 */}
        <ContextMenuTrigger holdToDisplay={-1} id="card-empty-context-menu-trigger">
          <Selection files={files} isShowContextMenu={isShowContextMenu} isContentLoading={this.props.isContentLoading}></Selection>
        </ContextMenuTrigger>
        {/* 卡片右击菜单 */}
        <ContextMenu id="card-context-menu-trigger" onHide={this.contextMenuHide} onShow={this.contextMenuShow}>
          <MenuItem data={{ action: 'copy' }} onClick={this.handleContextMenuClick}>
            <span className="context-menu-span">
              复制
              <span>
                <p className="key">⌘</p><p className="key">⌥</p>
              </span>
            </span>
          </MenuItem>
          <MenuItem data={{ action: 'copyPath' }} onClick={this.handleContextMenuClick}>
            <span className="context-menu-span">
              复制文件路径
              <span>
                <p className="key">⌥</p><p className="key">⌘</p><p className="key">C</p>
              </span>
            </span>
          </MenuItem>
          <MenuItem data={{ action: 'cut' }} onClick={this.handleContextMenuClick}>
            <span className="context-menu-span">
              剪切
              <span>
                <p className="key">⌘</p><p className="key">X</p>
              </span>
            </span>
          </MenuItem>
          <MenuItem data={{ action: 'rename' }} onClick={this.handleContextMenuClick}>
            重命名
          </MenuItem>
          <MenuItem divider />
          <MenuItem data={{ action: 'open-in-finder' }} onClick={this.handleContextMenuClick}>
            <span className="context-menu-span">
              在访达中打开
                <span>
                <p className="key">⌘</p><p className="key">↵</p>
              </span>
            </span>
          </MenuItem>
          <MenuItem divider />
          <MenuItem data={{ action: 'remove' }} onClick={this.handleContextMenuClick}>
            丢到垃圾桶
          </MenuItem>
        </ContextMenu>
        {/* 空白区域右击菜单 */}
        <ContextMenu id="card-empty-context-menu-trigger">
          <MenuItem data={{ action: 'refresh' }} onClick={this.handleContextMenuClick}>
            <span className="context-menu-span">
              刷新
              <span>
                <p className="key">F5</p>
              </span>
            </span>
          </MenuItem>
          <MenuItem divider />
          <MenuItem data={{ action: 'createDir' }} onClick={this.handleContextMenuClick}>
            新建文件夹
          </MenuItem>
        </ContextMenu>
      </div>
    );
  }
}

Content.propTypes = {
  folderPathActiveInSider: propTypes.string,
  isContentLoading: propTypes.bool
};

export default connect(
  (state) => ({
    folderPathActiveInSider: state.get('folderPathActiveInSider'),
    isContentLoading: state.get('isContentLoading')
  }),
  {
    setContentLoading,
    setSelectedCardList
  }
)(Content);