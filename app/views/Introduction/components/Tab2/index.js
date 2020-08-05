import React, { Component } from 'react';
import propTypes, { func } from 'prop-types';
import { connect } from 'react-redux';
import "./style.scss";
import CreatableSelect from 'react-select/creatable';

import Immutable from 'immutable';

import db from '@app/db'
import utils from '@app/utils';
import { List } from 'immutable';

import { Input } from 'antd';
const { TextArea } = Input;

const sanitize = require("sanitize-filename");

class Introduction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      descVal: "",
      filenameVal: ""
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!Immutable.is(this.props.selectedCardList, nextProps.selectedCardList)) {
      let descVal = ""
      let descArr = [];
      nextProps.selectedCardList.forEach((s) => {
        if (s.type === 'file') {
          let tmpDesc = db.getDesc({
            id: utils.guid(),
            path: s.path,
            modificationTime: Date.now(),
            desc: ""
          })
          descArr.push(tmpDesc);
        }
      })
      if (descArr.length = 1) {
        descVal = descArr[0]
      }
      let filenameVal = this.getFileName(nextProps.selectedCardList);
      this.setState({
        descVal,
        filenameVal
      })
    }
  }

  componentWillMount() {
    this.setState({
      filenameVal: this.getFileName(this.props.selectedCardList)
    })
  }
  /** */
  descAreaOnBlur = () => {
    this.props.selectedCardList.forEach((s) => {
      if (s.type === 'file') {
        db.saveDesc({
          id: utils.guid(),
          path: s.path,
          modificationTime: Date.now(),
          desc: ""
        }, this.state.descVal)
      }
    })
  }
  descAreaChange = (e) => {
    let descVal = e.target.value
    this.setState({
      descVal
    })
  }
  filenameChange = (e) => {
    let filenameVal = e.target.value
    let aaa = sanitize(filenameVal);
    console.log(aaa);
    this.setState({
      filenameVal

    })
  }
  getFileName(selectedCardList) {
    let result = ""
    if (selectedCardList.size === 1) {
      let selectCard = selectedCardList.get(0);
      console.log(selectCard, 'selectCard')
      if (selectCard.type === 'file') {
        result = utils.getFileName(selectCard.name, selectCard.extension);
      }
    }
    return result;
  }
  render() {
    let { descVal, filenameVal } = this.state
    return (
      <div >
        {
          filenameVal === '' ? null : <div className="item-text">
            <Input placeholder="文件名" value={filenameVal} onChange={this.filenameChange} />
          </div>
        }
        <div className="item-text">
          <TextArea value={descVal} onChange={this.descAreaChange} rows={4} onBlur={this.descAreaOnBlur} placeholder="添加描述" />,
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