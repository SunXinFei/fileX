import React, { Component } from 'react';
import { connect } from 'react-redux';
import CardImage from '../CardImage';
import { setFolderPathActiveInSiderAsync, setUndoList, setRedoList, setReaderModalObj, setSelectedCardList } from '@app/store/action';
import { message } from 'antd';
import "./style.scss";
import { DragSource, DropTarget } from 'react-dnd-cjs';
import { List, Map } from 'immutable';
import propTypes from 'prop-types';
import { ContextMenuTrigger } from "react-contextmenu";

import utils from '@app/utils';

const groupItemSource = {
  beginDrag(props, monitor, component) {
    console.log('beginDDD123');
    return {
      id: props.id,
      index: props.index,
      type: props.type
    }
  },
  endDrag(props, monitor) {
    console.log('end555');
    const item = monitor.getItem()
    const dropResult = monitor.getDropResult()
    // if (dropResult) {
    //   alert(`You dropped ${item.name} into ${dropResult.name}!`)
    // }
  },
}


const contextMenuCollect = (props) => {
  return {
    file: props.file
  };
}

@DragSource(
  'item',
  groupItemSource,
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }),
)

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  doClickAction = (e) => {
    console.log(' click');
    const { index, file } = this.props;
    //多选操作
    if (e.ctrlKey || e.metaKey) {
      let tmpList = List([]);
      let tmpIndex = utils.getSelectedIndex(this.props.selectedCardList, file.path);
      //如果当前文件已经被选中，则取消选中
      if (tmpIndex !== -1) {
        tmpList = this.props.selectedCardList.delete(tmpIndex);
      } else {//如果当前文件未被选中，则选中该文件
        tmpList = this.props.selectedCardList.push({
          ...file
        })
      }
      this.props.setSelectedCardList(tmpList)
      console.log('ctrl按键')
      return;
    }
    //shift键-逻辑为xmind
    //将当前最后选中的index与shift的index做比较
    //两者之内的全部选中
    if (e.shiftKey) {
      //获取最后一个元素
      let lastItem = this.props.selectedCardList.get(-1)
      if (lastItem) {//获取该元素与shift之间的所有元素并选中
        this.props.selectCardsByShift(lastItem, file)
      } else {//数组为空，将该元素选中
        this.props.setSelectedCardList(List([{
          ...file
        }]))
      }
      console.log('shift按键')
      return;
    }
    this.props.setSelectedCardList(List([{
      ...file
    }]))
  }
  /**
   * 双击处理事件
   */
  doDoubleClickAction = async (type, floderPath, name, extension) => {
    console.log('Double Click')
    //如果是文件夹
    if (type === 'directory') {
      let isExist = await this.props.setFolderPathActiveInSiderAsync(floderPath);
      if (!isExist) {
        message.error('该路径已被删除或移动');
        return;
      }
      //redo与undo操作
      this.props.setUndoList(this.props.undoPathList.push(floderPath));
      this.props.setRedoList(List([]));
    } else {
      if (extension === '.pdf') {
        //显示pdf模态框
        this.props.setReaderModalObj(Map({ filePath: floderPath, fileName: name, visible: true }));
      }
    }
  }
  /**
   * 单击事件
   */
  handleClick = (e) => {
    utils.clearEventBubble(e)
    this.doClickAction(e);
  }
  /**
   * 双击事件
   */
  handleDoubleClick = (e, type, path, name, extension) => {
    utils.clearEventBubble(e)
    this.doDoubleClickAction(type, path, name, extension);
  }

  render() {
    const { index, file, connectDragSource } = this.props;
    const { type, extension, path, name } = file;
    const isSelectCard = utils.getSelectedIndex(this.props.selectedCardList, path) !== -1;
    return (
      <ContextMenuTrigger index={index} file={file} collect={contextMenuCollect} holdToDisplay={-1} id="card-context-menu-trigger">
        <div
          ref={elm => {
            connectDragSource(elm)
            if (!elm) return;
            this.props.getRef(elm, file);
          }}
          className={isSelectCard ? "filex-content-main-card selected" : "filex-content-main-card"}
          key={index}
          style={{ width: '110px' }}
          onClick={(e) => { this.handleClick(e) }}
          onDoubleClick={(e) => { this.handleDoubleClick(e, type, path, name, extension) }}>
          <div className="card-prew">
            <CardImage type={type} extension={extension}></CardImage>
          </div>
          <div className="card-filename">
            {name}
          </div>
        </div>
      </ContextMenuTrigger>
    );
  }
}

Card.propTypes = {
  undoPathList: propTypes.instanceOf(List),
  selectedCardList: propTypes.instanceOf(List)
};

export default connect(
  (state) => ({
    undoPathList: state.get('undoPathList'),
    selectedCardList: state.get('selectedCardList'),
  }),
  {
    setFolderPathActiveInSiderAsync,
    setUndoList,
    setRedoList,
    setReaderModalObj,
    setSelectedCardList
  }
)(Card);