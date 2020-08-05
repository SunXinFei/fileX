import React, { Component } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';

import path from "path";
import { setFolderPathActiveInSiderAsync, setVisibleInvalidPathModal, setUndoList, setRedoList } from '@app/store/action';
import "./style.scss";
import { DragSource, DropTarget } from 'react-dnd-cjs';
import { Icon } from 'antd';
import { ContextMenuTrigger } from "react-contextmenu";
import { List } from 'immutable';

const groupItemSource = {
  beginDrag(props, monitor, component) {
    console.log(props.folderPath);
    return {
      folderPath: props.folderPath,
      index: props.index,
      type: props.type,
      belong: 'sider-local'
    }
  },
  endDrag(props, monitor) {
    const item = monitor.getItem()
    const dropResult = monitor.getDropResult()
    if (dropResult) {
      // console.log(dropResult,'dropResult');
      // alert(`You dropped ${item.folderPath} into ${dropResult.folderPath}!`)
    }
  },
}

const groupItemTarget = {
  hover(props, monitor, component) {
    const hoverItem = props;
    const dragItem = monitor.getItem();
    // console.log();
    if (hoverItem.folderPath === dragItem.folderPath) {
      return false;
    }
    const canDrop = monitor.canDrop()
    console.log('hover', 'canDrop', canDrop);
  },
  drop(props, monitor, component) {
    const dragItem = monitor.getItem();
    const dropItem = props;
    console.log('drop');

  },
  canDrop(props, monitor) {
    const hoverItem = props;
    const dragItem = monitor.getItem();
    if (hoverItem.folderPath === dragItem.folderPath) {
      return false;
    }
    return true;
  }
}

function contextMenuCollect(props) {
  return {
    index: props.index,
    path: props.path
  };
}

@DragSource('item', groupItemSource,
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }),
)

@DropTarget('item', groupItemTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))

class SiderCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * 打开某文件夹
   * @param {String} floderPath 文件夹路径
   */
  openFolder = async (floderPath) => {
    if (this.props.folderPathActiveInSider === floderPath) {
      return;
    }
    let isExist = await this.props.setFolderPathActiveInSiderAsync(floderPath);
    if (!isExist) {
      this.props.setVisibleInvalidPathModal(floderPath);
      return;
    }
    //undoList默认填充地址
    //redoList默认为空
    this.props.setUndoList(List([floderPath]));
    this.props.setRedoList(List([]));
  }
  /**
   * 获取文件夹名称
   * @param {String} floderPath 文件夹路径
   */
  getFolderName = (floderPath) => {
    return path.basename(floderPath);
  }

  render() {
    const { index, folderPath, contextMenuTriggerIndex, folderPathActiveInSider } = this.props;
    const { connectDragSource, connectDropTarget, isDragging, isOver, canDrop } = this.props;
    const isActive = folderPathActiveInSider.indexOf(folderPath) === 0;
    const backgroundColor = isOver && canDrop && '#1890ff33';
    const opacity = isDragging ? 0.5 : 1
    const boxShadow = contextMenuTriggerIndex === index && '0 0 0px 1px rgb(42, 96, 228)';
    return (
      <ContextMenuTrigger path={folderPath} index={index} collect={contextMenuCollect} holdToDisplay={-1} id="sider-card-context-menu-trigger">
        <li ref={elm => {
          connectDragSource(elm)
          connectDropTarget(elm)
        }} style={{ boxShadow: boxShadow, backgroundColor: backgroundColor, opacity: opacity }} className={isActive ? 'sider-card active' : 'sider-card'} key={index} onClick={() => { this.openFolder(folderPath); }}>
          <Icon className="folder-icon" type={isActive ? "folder-open" : "folder"} />
          {this.getFolderName(folderPath)}
        </li>
      </ContextMenuTrigger>
    );
  }
}


SiderCard.propTypes = {
  index: propTypes.number,
  folderPath: propTypes.string,
  folderPathActiveInSider: propTypes.string,
  connectDragSource: propTypes.object
};

export default connect(
  (state) => ({
    folderPathActiveInSider: state.get('folderPathActiveInSider')
  }),
  {
    setFolderPathActiveInSiderAsync,
    setVisibleInvalidPathModal,
    setUndoList,
    setRedoList
  }
)(SiderCard);