import React, { Component } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';

import path from "path";
import { addFolderPathForLocal, setFolderPathActiveInSiderAsync, setVisibleInvalidPathModal } from '@app/store/action';
import "./style.scss";
import { DropTarget } from 'react-dnd-cjs';
import { Icon } from 'antd';

import { List } from 'immutable';

const groupItemTarget = {
  hover(props, monitor, component) {
    const hoverItem = props;
    const dragItem = monitor.getItem();
    const canDrop = monitor.canDrop()
    console.log('hover', 'canDrop', canDrop);
  },
  drop(props, monitor, component) {
    const dragItem = monitor.getItem();
    const dropItem = props;
    if (dragItem.belong === 'sider-local') {
      console.log(dragItem.index, dropItem.index);
      let tmpItem = props.folderPathLocal.get(dragItem.index)
      if (dragItem.index > dropItem.index) {//向上移动
        let tmpLocalList = props.folderPathLocal.delete(dragItem.index);
        let resultLocalList = tmpLocalList.insert(dropItem.index, tmpItem)
        props.addFolderPathForLocal(resultLocalList)
      } else if (dragItem.index < dropItem.index) {//向下移动
        let tmpLocalList = props.folderPathLocal.delete(dragItem.index);
        let resultLocalList = tmpLocalList.insert(dropItem.index - 1, tmpItem)
        props.addFolderPathForLocal(resultLocalList)
      }
    }

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

@DropTarget('item', groupItemTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))

class EmptyArea extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { index, folderPath, folderPathActiveInSider } = this.props;
    const { connectDropTarget, isOver, canDrop } = this.props;
    const opacity = isOver ? 1 : 0;
    return (
      <div ref={connectDropTarget} style={{ opacity: opacity }} className='empty-area' key={index}>
      </div>
    );
  }
}


EmptyArea.propTypes = {
  index: propTypes.number,
  folderPath: propTypes.string,
  folderPathLocal: propTypes.instanceOf(List),
  folderPathActiveInSider: propTypes.string,
  connectDragSource: propTypes.object
};

export default connect(
  (state) => ({
    folderPathLocal: state.get('folderPathLocal'),
    folderPathActiveInSider: state.get('folderPathActiveInSider')
  }),
  {
    setFolderPathActiveInSiderAsync,
    setVisibleInvalidPathModal,
    addFolderPathForLocal
  }
)(EmptyArea);