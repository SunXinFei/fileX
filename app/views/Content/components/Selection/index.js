import React, { Component } from 'react';
import { connect } from 'react-redux';
import "./style.scss";


import Card from '../Card';
import { Spin, Icon } from 'antd';

import { List } from 'immutable';
import { setSelectedCardList } from '@app/store/action';

import utils from '@app/utils';

class Selection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emptyFilesLength: 30,
      isMouseDown: false,
      startX: 0,
      startY: 0,
      selectEle: {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        display: 'none'
      },
    };
    this.cardObjList = []
  }
  getEmptyDom = () => {
    let emptyFiles = [];
    for (let i = 0; i < this.state.emptyFilesLength; i++) {
      emptyFiles.push(
        <div key={i} className="flex-empty" style={{ width: '110px' }}>
        </div>
      )
    }
    return emptyFiles;
  }
  /**取消选中卡片 */
  cancelSelectCard = () => {
    console.log("click冒泡");
    this.props.setSelectedCardList(List([]))
  }
  down = (e) => {
    // utils.clearEventBubble(e)
    //如果目标不是容器那么不进行事件处理
    if (e.target.className !== "filex-content-main" && e.target.className !== "flex-empty") {
      return
    }
    this.cancelSelectCard()
    const { clientX, clientY } = e
    let { selectEle } = this.state
    //计算框选范围的起始位置
    const top = e.currentTarget.offsetTop
    const left = e.currentTarget.offsetLeft
    const { scrollTop, scrollLeft } = e.currentTarget;

    const startX = clientX - left + scrollLeft;
    const startY = clientY - top + + scrollTop;

    selectEle.left = startX
    selectEle.top = startY
    this.setState({ isMouseDown: true, startX, startY, selectEle })
  }
  move = (e) => {
    // utils.clearEventBubble(e)
    e.stopPropagation()
    const { isMouseDown, selectEle, startX, startY, } = this.state

    if (!isMouseDown) return

    const { clientX, clientY } = e;
    const { scrollTop, scrollLeft } = e.currentTarget;
    //计算框选范围，scrollTop与scrollLeft考虑滚动条的情况
    const top = e.currentTarget.offsetTop;
    const left = e.currentTarget.offsetLeft;
    const _x = clientX - left + scrollLeft;
    const _y = clientY - top + scrollTop;
    //框选范围样式设置，并进行判断，兼容鼠标向逆方向框选
    selectEle.left = _x > startX ? startX - 1 : _x + 1
    selectEle.top = _y > startY ? startY - 1 : _y + 1
    selectEle.width = Math.abs(_x - startX)
    selectEle.height = Math.abs(_y - startY)
    selectEle.display = 'block'
    //将每一个文件卡片与框选范围进行碰撞监测
    let selectCardObjList = [];
    this.cardObjList.forEach((c) => {
      if (utils.checkInRect(selectEle, c.pos, this.refs.container.getBoundingClientRect(), scrollTop, scrollLeft)) {
        selectCardObjList.push({ ...c.file })
      }
    })
    this.props.setSelectedCardList(List(selectCardObjList))

    this.setState({ selectEle })
  }
  up = (e) => {
    // utils.clearEventBubble(e)
    const { selectEle } = this.state
    //重置框选范围样式以及变量
    selectEle.left = 0
    selectEle.top = 0
    selectEle.width = 0
    selectEle.height = 0
    selectEle.display = 'none'
    this.setState({ isMouseDown: false, selectEle })
  }
  getCardList(files) {
    let cardList = []
    this.cardObjList = []
    files.map((file, index) => {
      cardList.push(
        <Card getRef={(elm, file) => (this.cardObjList.push({ pos: elm.getBoundingClientRect(), file }))} key={index} index={index} file={file} selectCardsByShift={this.selectCardsByShift} />
      )
    })

    return cardList
  }
  /**
 * 通过当前选中列表最后一个元素以及shift触发元素，选中之间元素的逻辑
 * @param {Object} lastItem 选中列表最后的元素
 * @param {Object} targetItem shift触发元素
 */
  selectCardsByShift = (lastItem, targetItem) => {
    let lastIndex = -1;
    let targetIndex = -1;
    //获取两个元素所在的index值
    this.props.files.forEach((f, i) => {
      if (f.path == lastItem.path) {
        lastIndex = i;
      }
      if (f.path == targetItem.path) {
        targetIndex = i;
      }
    })
    let minIndex = 0;
    let maxIndex = 0;
    //如果两者index相等则直接返回，否则区分开最大与最小的index
    if (lastIndex === targetIndex) {
      return;
    } else if (lastIndex > targetIndex) {
      minIndex = targetIndex;
      maxIndex = lastIndex;
    } else {
      minIndex = lastIndex;
      maxIndex = targetIndex;
    }
    //将min与max中间的进行遍历，将未选的加入数组
    let tmpList = [];
    this.props.files.forEach((f, i) => {
      if (i >= minIndex && i <= maxIndex && utils.getSelectedIndex(this.props.selectedCardList, f.path) == -1) {
        tmpList.push(f);
      }
    })
    //新旧数组拼接
    let resultList = this.props.selectedCardList.concat(List(tmpList))
    this.props.setSelectedCardList(resultList)
  }
  render() {
    const { isContentLoading, isShowContextMenu, files } = this.props;
    const { selectEle } = this.state;
    return (
      <div
        ref='container'
        onMouseDown={this.down}
        onMouseMove={this.move}
        onMouseUp={this.up}
        className={isShowContextMenu ? 'filex-content-main forbid-scroll' : 'filex-content-main'}>
        {isContentLoading ? <Spin indicator={<Icon type="loading-3-quarters" style={{ fontSize: 24, margin: 6 }} spin />} className="content-loading" /> : null}
        {
          this.getCardList(files)
        }
        {/* 填充30个空dom，来解决flex中space-between布局的问题 */}
        {this.getEmptyDom()}
        <div className='selection-element' style={{ ...selectEle }} />
      </div>
    );
  }
}

export default connect(
  (state) => ({
    selectedCardList: state.get('selectedCardList'),
  }),
  {
    setSelectedCardList
  }
)(Selection); 