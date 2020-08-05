import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import "./style.scss";

import { List } from 'immutable';

import fsExtra from 'fs-extra';
import electron from "electron";
const { dialog } = electron.remote;
const { shell } = electron;

import { addFolderPathForLocal, setFolderPathActiveInSider, setUndoList, setRedoList, setFolderPathActiveInSiderAsync, setVisibleInvalidPathModal } from '@app/store/action';
import { Icon, message } from 'antd';
import SiderCard from './components/SiderCard'
import EmptyArea from './components/EmptyArea'

import { ContextMenu, MenuItem } from "react-contextmenu";

class Sider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contextMenuTriggerIndex: -1
    };
  }
  /**
   * 添加本地文件夹到项目列表中  
   */
  addLocalFile = async () => {
    //返回undefined（取消按钮）/ 文件夹路径（确认按钮）
    let filePath = await dialog.showOpenDialog(
      { properties: ["openDirectory"] }
    );
    //文件夹路径存在
    if (filePath) {
      //判断是否已添加
      if (this.props.folderPathLocal.includes(String(filePath))) {
        message.warning('该文件夹已存在');
        return;
      }
      this.props.setFolderPathActiveInSider(String(filePath))
      this.props.addFolderPathForLocal(this.props.folderPathLocal.push(String(filePath)));
    }
  }

  handleContextMenuClick = async (e, data) => {
    console.log(data);
    switch (data.action) {
      case 'removeFromSider':
        this.removeFromSider(this.state.contextMenuTriggerIndex);
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
    }
  }

  removeFromSider(targetIndex) {
    console.log(this.props.folderPathLocal.get(targetIndex) ,'???????',this.props.folderPathActiveInSider)
    //如果移除的边栏文件夹路径与当前选中的路径相同, 则清除当前选中的路径
    if (this.props.folderPathLocal.get(targetIndex) === this.props.folderPathActiveInSider) {
      this.props.setFolderPathActiveInSider('');
      //undoList默认填充地址
      //redoList默认为空
      this.props.setUndoList(List([]));
      this.props.setRedoList(List([]));
    }
    this.props.addFolderPathForLocal(this.props.folderPathLocal.delete(targetIndex));

  }

  contextMenuShow = (e) => {
    this.setState({
      contextMenuTriggerIndex: e.detail.data.index
    })
  }

  contextMenuHide = (e) => {
    this.setState({
      contextMenuTriggerIndex: -1
    })
  }

  render() {
    let { folderPathLocal } = this.props;
    console.log(folderPathLocal,'folderPathLocalfolderPathLocalfolderPathLocalfolderPathLocal')
    return (
      <div className="filex-sider">
        <div className="sider-content">
          <span className="title" onClick={this.addLocalFile}>
            本地文件管理
            <Icon style={{ fontSize: '18px' }} type="folder-add" />
          </span>
          <ul className="file-path-list">
            {
              folderPathLocal.map((f, index) => {
                return (
                  <React.Fragment key={index}>
                    <EmptyArea index={index} folderPath={f}></EmptyArea>
                    <SiderCard contextMenuTriggerIndex={this.state.contextMenuTriggerIndex} index={index} folderPath={f} />
                    {index === folderPathLocal.size - 1 ? <EmptyArea index={folderPathLocal.size} folderPath={f}></EmptyArea> : null}
                  </React.Fragment>
                )
              })
            }
          </ul>
          <ContextMenu id="sider-card-context-menu-trigger" onHide={this.contextMenuHide} onShow={this.contextMenuShow}>
            <MenuItem data={{ action: 'copy' }} onClick={this.handleContextMenuClick}>
              <span className="context-menu-span">
                复制
                <span>
                  <p className="key">⌘</p><p className="key">C</p>
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
            <MenuItem data={{ action: 'removeFromSider' }} onClick={this.handleContextMenuClick}>
              <span className="context-menu-span">
                从边栏移除
                <span>
                  <p className="key">⌘</p><p className="key">⌫</p>
                </span>
              </span>
            </MenuItem>
          </ContextMenu>
        </div>
        {/* <div className="sider-content">
          <span className="title">
            远端文件管理
            <Icon style={{ fontSize: '18px' }} type="plus-circle" />
          </span>
        </div> */}
        <div className="footer">
          <span>
            <Icon type="delete" />
            回收站
          </span>
          <span>
            <Icon type="share-alt" />
            我的分享
          </span>
        </div>
      </div>

    );
  }
}

Sider.propTypes = {
  folderPathLocal: propTypes.instanceOf(List),
  folderPathActiveInSider: propTypes.string
};

export default connect(
  (state) => ({
    folderPathLocal: state.get('folderPathLocal'),
    folderPathActiveInSider: state.get('folderPathActiveInSider')
  }),
  {
    addFolderPathForLocal,
    setUndoList,
    setRedoList,
    setFolderPathActiveInSider,
    setFolderPathActiveInSiderAsync,
    setVisibleInvalidPathModal
  }
)(Sider);