
import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import "./style.scss";
import { Icon, Radio } from 'antd';
import { List } from 'immutable';
import { setFolderPathActiveInSiderAsync, setRedoList, setUndoList } from '@app/store/action';
import { message } from 'antd';

class ContentRouter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  /**
   * 由于undoList末尾存储的是当前地址，故如果想获取上一个地址需要指针移动两位
   * 默认会放置初始边栏的sider的地址作为第一项
   * undo操作时，undo弹栈，redoList接收弹栈的数据
   */
  undo = async () => {
    if (this.props.undoPathList.size <= 1) {
      return
    }
    const floderPath = this.props.undoPathList.get(this.props.undoPathList.size - 2);
    const lastPath = this.props.undoPathList.get(this.props.undoPathList.size - 1);
    let isExist = await this.props.setFolderPathActiveInSiderAsync(floderPath);
    if (!isExist) {
      message.error('该路径已被删除或移动');
      return;
    }

    this.props.setUndoList(this.props.undoPathList.pop());
    this.props.setRedoList(this.props.redoPathList.push(lastPath));
  }
  /**
   * redoList可以为空，将redoList中的地址弹栈，redoList压栈即可
   */
  redo = async () => {
    if (this.props.redoPathList.size <= 0) {
      return
    }
    const floderPath = this.props.redoPathList.get(this.props.redoPathList.size - 1);
    let isExist = await this.props.setFolderPathActiveInSiderAsync(floderPath);
    if (!isExist) {
      message.error('该路径已被删除或移动');
      return;
    }
    this.props.setRedoList(this.props.redoPathList.pop());
    this.props.setUndoList(this.props.undoPathList.push(floderPath));
  }

  render() {
    const undoOpacity = this.props.undoPathList.size <= 1 ? 0.5 : 1;
    const redoOpacity = this.props.redoPathList.size <= 0 ? 0.5 : 1;
    return (
      <div className="filex-content-router">
        <div className="redo-undo">
          <Radio.Group>
            <Radio.Button style={{ opacity: undoOpacity }} onClick={() => { this.undo() }} className="redo-undo-button"><Icon type="left" /></Radio.Button>
            <Radio.Button style={{ opacity: redoOpacity }} onClick={() => { this.redo() }} className="redo-undo-button"><Icon type="right" /></Radio.Button>
          </Radio.Group>
        </div>
        {this.props.folderPathActiveInSider}
      </div>
    );
  }
}

ContentRouter.propTypes = {
  folderPathActiveInSider: propTypes.string,
  undoPathList: propTypes.instanceOf(List),
  redoPathList: propTypes.instanceOf(List),
};

export default connect(
  (state) => ({
    folderPathActiveInSider: state.get('folderPathActiveInSider'),
    undoPathList: state.get('undoPathList'),
    redoPathList: state.get('redoPathList')
  }),
  {
    setFolderPathActiveInSiderAsync,
    setRedoList,
    setUndoList
  }
)(ContentRouter);