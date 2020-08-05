import { Modal, Button } from 'antd';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import React, { Component } from 'react';
import { setVisibleInvalidPathModal, addFolderPathForLocal } from '../../store/action';
import { List } from 'immutable';

class InvalidPathModal extends Component {
  constructor(props) {
    super(props);
  }

  handleOk = e => {
    console.log(this.props.visibleInvalidPathModal, 'ok');
    this.props.setVisibleInvalidPathModal("");
    this.removeFromSider(this.props.folderPathLocal.indexOf(this.props.visibleInvalidPathModal));
  };

  handleCancel = e => {
    console.log(this.props.visibleInvalidPathModal, 'cancel');
    this.props.setVisibleInvalidPathModal("");
  };

  removeFromSider(targetIndex) {
    this.props.addFolderPathForLocal(this.props.folderPathLocal.delete(targetIndex));
  }

  render() {
    let { visibleInvalidPathModal } = this.props
    return (
      <Modal
        title="路径未找到"
        visible={visibleInvalidPathModal !== ""}
        okText='删除'
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <p>{visibleInvalidPathModal}</p>
        <p>该路径已被删除或移动</p>
      </Modal>
    );
  }
}


InvalidPathModal.propTypes = {
  folderPathLocal: propTypes.instanceOf(List),
  folderPathActiveInSider: propTypes.string,
  visibleInvalidPathModal: propTypes.string
};

export default connect(
  (state) => ({
    folderPathLocal: state.get('folderPathLocal'),
    folderPathActiveInSider: state.get('folderPathActiveInSider'),
    visibleInvalidPathModal: state.get('visibleInvalidPathModal')
  }),
  {
    setVisibleInvalidPathModal,
    addFolderPathForLocal
  }
)(InvalidPathModal);